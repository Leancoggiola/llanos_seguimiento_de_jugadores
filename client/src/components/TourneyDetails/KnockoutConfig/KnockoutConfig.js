import { cloneDeep, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcTrophy, notificationIcEventNote } from '../../../assets/icons';
import { Accordion, AccordionContent, AccordionTrigger } from '../../../commonComponents/Accordion';
import Button from '../../../commonComponents/Button';
import Icon from '../../../commonComponents/Icon';
import { TabControl, TabNavigator } from '../../../commonComponents/TabNavigator';
import DeleteConfirmation from '../../DeleteConfirmation';
import MatchCard from '../MatchCard/MatchCard';
import MatchDetails from '../MatchDetails/MatchDetails';
// Middleware
import { navbarNewEntry } from '../../../middleware/actions/navbarActions';
// Styling
import './KnockoutConfig.scss';

const KnockoutConfig = (props) => {
    const { tourney, setTourneyData } = props;
    const [tabIndex, setTabIndex] = useState(0);

    const getScore = (match) => {
        if (isEmpty(match.details)) return 'Sin resultados';
        if (match.details.some((x) => x.type === 'sin goles')) return '0:0';
        const goals = match.teams.reduce(
            (prev, curr, index) => {
                prev[index] = match.details.filter((x) => curr.players.map((x) => x._id).includes(x.player._id) && x.type === 'gol').length;
                return prev;
            },
            [0, 0]
        );
        return goals.join(':');
    };

    return (
        <div className="knockout-config">
            <TabNavigator defaultActiveKey={tabIndex} className="knockout-config-navigator">
                <TabControl onClick={() => setTabIndex(0)}>
                    <Icon src={notificationIcEventNote} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(1)}>
                    <Icon src={contentIcTrophy} />
                </TabControl>
            </TabNavigator>
            <div className="knockout-config-content">{tabIndex === 0 && <Calendario tourney={tourney} setTourneyData={setTourneyData} getScore={getScore} />}</div>
        </div>
    );
};

const Calendario = ({ tourney, setTourneyData, getScore }) => {
    const { data: teamList } = useSelector((state) => state.team.teamList);
    const totalGroups = Number(tourney.configs.group.totalGroups);

    const addFirstStage = () => {
        if (totalGroups === 1) {
            tourney.knockout = tourney.groups.map((group) => {
                const teamsToSort = group.table.map((x) => teamList.find((team) => team._id === x._id));
                const totalTeams = [...teamsToSort];

                let matchs = [
                    {
                        week: 1,
                        matchOrder: 0,
                        teams: [
                            teamsToSort[0],
                            {
                                _id: null,
                                name: 'Clasificado directo',
                            },
                        ],
                        details: [],
                        winner: teamsToSort[0]._id,
                    },
                ];

                teamsToSort.shift();
                if (teamsToSort.length % 2 !== 0) {
                    teamsToSort.pop();
                    totalTeams.pop();
                }

                const total = teamsToSort.length;
                const half = Math.floor(total / 2);

                for (let i = 0; i < half; i++) {
                    matchs.push({
                        week: 1,
                        matchOrder: i + 1,
                        teams: [teamsToSort[i], teamsToSort[total - i - 1]],
                        details: [],
                        winner: null,
                    });
                }

                return {
                    stage: `Etapa 1`,
                    teams: totalTeams.map((x) => x._id),
                    matchs,
                };
            });
        }
        if (totalGroups === 2) {
            const teamsToSortA = tourney.groups[0].table.map((x) => teamList.find((team) => team._id === x._id));
            const teamsToSortB = tourney.groups[1].table.map((x) => teamList.find((team) => team._id === x._id));

            const totalCruces = Math.ceil(Math.max(teamsToSortA.length, teamsToSortB.length) / 2);
            let matchs = [];
            let teams = [];

            for (let i = 0; i < totalCruces; i++) {
                matchs.push({
                    week: 1,
                    matchOrder: i + 1,
                    teams: [teamsToSortA[i], teamsToSortB[totalCruces - i - 1]],
                    details: [],
                    winner: null,
                });
                teams.push(teamsToSortA[i]._id, teamsToSortB[totalCruces - i - 1]._id);
            }
            tourney.knockout = { stage: `Etapa 1`, teams, matchs };
        }
        setTourneyData(cloneDeep(tourney));
    };

    const dispatch = useDispatch();
    const [matchDetails, setMatchDetails] = useState(null);
    const [open, setOpen] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);

    const firstAccordionConf = {
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
    };

    const goToMatchDetails = (match) => {
        setMatchDetails(match);
        dispatch(navbarNewEntry({ action: setMatchDetails, param: false }));
    };

    useEffect(() => {
        if (matchDetails) {
            tourney.knockout.forEach((g) => {
                g.matchs.forEach((m) => {
                    if (m.matchOrder === matchDetails.matchOrder && m.week === matchDetails.week && g.name === matchDetails.groupName) {
                        m.details = [...matchDetails.details];
                        if (!isEmpty(m.details)) {
                            const results = getScore(m).split(':');
                            m.winner = results[0] === results[1] ? 'empate' : results[0] > results[1] ? m.teams[0]._id : m.teams[1]._id;
                        } else {
                            m.winner = null;
                            m.date = null;
                        }
                    }
                });
            });
            setTourneyData(cloneDeep(tourney));
        }
    }, [matchDetails]);

    const updateMatchDate = (date, match, groupName) => {
        const groupIndex = tourney.knockout.findIndex((x) => x.name === groupName);
        const matchIndex = tourney.knockout[groupIndex].matchs.findIndex((x) => x.matchOrder === match.matchOrder && x.week === match.week);
        tourney.knockout[groupIndex].matchs[matchIndex].date = date;
        setTourneyData({ ...tourney });
    };

    const handleDeleteCalendar = () => {
        setTourneyData({
            ...tourney,
            knockout: tourney.knockout.map((x) => ({ ...x, matchs: [] })),
        });
        setDeleteModal(false);
    };

    return (
        <>
            {matchDetails ? (
                <MatchDetails match={matchDetails} setMatchDetails={setMatchDetails} getScore={getScore} />
            ) : tourney.knockout.length ? (
                <>
                    {tourney.knockout.map((stage, index) => {
                        const jornadas = [...new Set(stage.matchs.map((x) => x.week))];
                        return (
                            <Accordion
                                className="knockout-config-content-calendar-accordion"
                                key={stage.stage}
                                alignIconRight
                                useChevronIcon
                                {...(index === 0 ? { ...firstAccordionConf } : null)}
                            >
                                <AccordionTrigger>{stage.stage}</AccordionTrigger>
                                <AccordionContent>
                                    {jornadas.map((i) => (
                                        <div className="jornada-container" key={`week-${i}`}>
                                            <h4>{`Jornada ${i}`}</h4>
                                            {stage.matchs
                                                .filter((x) => x.week === i)
                                                .map((x, index) => (
                                                    <MatchCard
                                                        match={x}
                                                        getScore={getScore}
                                                        goToMatchDetails={goToMatchDetails}
                                                        key={`match-card-${index}`}
                                                        group={stage}
                                                        category={tourney?.category}
                                                        updateMatchDate={updateMatchDate}
                                                        tourneyDate={tourney.createdOn}
                                                    />
                                                ))}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </Accordion>
                        );
                    })}
                    <div className="knockout-config-content-delete-btn">
                        <Button type="button" onClick={() => setDeleteModal(true)} variant="warn">
                            Eliminar calendario
                        </Button>
                    </div>
                </>
            ) : (
                <div className="knockout-config-content-btn">
                    <Button type="button" onClick={addFirstStage}>
                        Crear cruces
                    </Button>
                </div>
            )}
            <DeleteConfirmation show={deleteModal} onClose={() => setDeleteModal(false)} onSubmit={handleDeleteCalendar} message={'¿Seguro quieres eliminar el calendario?'} />
        </>
    );
};

export default KnockoutConfig;
