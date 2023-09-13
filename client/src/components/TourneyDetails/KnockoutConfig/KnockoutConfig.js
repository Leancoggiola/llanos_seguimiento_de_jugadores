import { cloneDeep, isEmpty, last, shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcTrophy, navigationIcClose, notificationIcEventNote } from '../../../assets/icons';
import { Accordion, AccordionContent, AccordionTrigger } from '../../../commonComponents/Accordion';
import Button from '../../../commonComponents/Button';
import FormField from '../../../commonComponents/FormField';
import Icon from '../../../commonComponents/Icon';
import IconButton from '../../../commonComponents/IconButton';
import Label from '../../../commonComponents/Label';
import { Option, Select } from '../../../commonComponents/Select';
import { TabControl, TabNavigator } from '../../../commonComponents/TabNavigator';
import DeleteConfirmation from '../../DeleteConfirmation';
import ManualTeamSelection from '../../ManualTeamSelection';
import MatchCard from '../MatchCard/MatchCard';
import MatchDetails from '../MatchDetails/MatchDetails';
// Middleware
import trophyIcon from '../../../assets/trophy-icon.webp';
import { navbarNewEntry } from '../../../middleware/actions/navbarActions';
// Styling
import './KnockoutConfig.scss';

const MOCKED_TEAM = {
    name: 'Desconocido',
    players: [],
    hidden: true,
    mocked: true,
};

const KnockoutConfig = (props) => {
    const { tourney, setTourneyData, handlePdf } = props;
    const [tabIndex, setTabIndex] = useState(0);
    const { data: teamList } = useSelector((state) => state.team.teamList);

    const getScore = (match) => {
        if (isEmpty(match.details) || match.details.every((x) => x.type !== 'sin goles' && x.type !== 'gol')) return 'Sin resultados';
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

    const haveWinner = () => {
        const lastStage = last(tourney.knockout);
        return lastStage?.matchs.length === 1 && lastStage?.matchs.every((x) => x.winner);
    };

    const getWinner = () => {
        const lastStage = last(tourney.knockout);
        return teamList.find((x) => x._id === lastStage.matchs[0].winner).name;
    };

    return (
        <div className="knockout-config">
            <TabNavigator defaultActiveKey={tabIndex} className="knockout-config-navigator">
                <TabControl onClick={() => setTabIndex(0)}>
                    <Icon src={notificationIcEventNote} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(1)} disabled={!haveWinner()}>
                    <Icon src={contentIcTrophy} />
                </TabControl>
            </TabNavigator>
            <div className="knockout-config-content">
                {tabIndex === 0 && <Calendario tourney={tourney} setTourneyData={setTourneyData} getScore={getScore} handlePdf={handlePdf} />}
                {tabIndex === 1 && <WinnerScreen winner={getWinner()} />}
            </div>
        </div>
    );
};

const Calendario = ({ tourney, setTourneyData, getScore, handlePdf }) => {
    const { data: teamList } = useSelector((state) => state.team.teamList);
    const totalGroups = Number(tourney.configs.group.totalGroups);

    const dispatch = useDispatch();
    const [matchDetails, setMatchDetails] = useState(null);
    const [open, setOpen] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalTeams, setDeleteModalTeams] = useState(false);
    const [teamSelectModal, setTeamSelectModal] = useState(false);
    const [configTeamsModal, setConfigTeams] = useState({ groupId: null, week: null, matchOrder: null, teams: [] });
    const [posToScroll, setPosToScroll] = useState();
    const [draftType, setDraftType] = useState(last(tourney.knockout)?.isManual ? 'manual' : 'random');

    const accordionConf = {
        open,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
    };

    useEffect(() => {
        if (matchDetails) {
            tourney.knockout.forEach((k) => {
                k.matchs.forEach((m) => {
                    if (m.matchOrder === matchDetails.matchOrder && m.week === matchDetails.week && k.name === matchDetails.groupName) {
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
        } else {
            posToScroll && window.scrollTo(0, posToScroll);
        }
    }, [matchDetails]);

    const addFirstStage = () => {
        const isManual = draftType === 'manual';
        if (totalGroups === 1) {
            tourney.knockout = tourney.groups.map((group) => {
                const teamsToSort = group.table.map((x) => teamList.find((team) => team._id === x._id));
                const totalTeams = [...teamsToSort];

                let matchs = [
                    {
                        week: 1,
                        matchOrder: 0,
                        teams: [
                            isManual ? MOCKED_TEAM : teamsToSort[0],
                            {
                                _id: '65012bf767e463f4f47fe668',
                                name: 'Clasificado directo',
                            },
                        ],
                        details: [],
                        winner: isManual ? null : teamsToSort[0]._id,
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
                        teams: [isManual ? MOCKED_TEAM : teamsToSort[i], isManual ? MOCKED_TEAM : teamsToSort[total - i - 1]],
                        details: [],
                        winner: null,
                    });
                }

                return {
                    name: `Etapa 1`,
                    teams: totalTeams.map((x) => x._id),
                    matchs,
                    order: 1,
                };
            });
        }
        if (totalGroups === 2) {
            const teamsToSortA = tourney.groups[0].table.map((x) => teamList.find((team) => team._id === x._id));
            const teamsToSortB = tourney.groups[1].table.map((x) => teamList.find((team) => team._id === x._id));

            const totalCruces = Math.ceil(Math.max(teamsToSortA.length, teamsToSortB.length));
            let matchs = [];
            let teams = [];

            for (let i = 0; i < totalCruces; i++) {
                matchs.push({
                    week: 1,
                    matchOrder: i + 1,
                    teams: [isManual ? MOCKED_TEAM : teamsToSortA[i], isManual ? MOCKED_TEAM : teamsToSortB[totalCruces - i - 1]],
                    details: [],
                    winner: null,
                });
                teams.push(teamsToSortA[i], teamsToSortB[totalCruces - i - 1]);
            }
            tourney.knockout = [{ name: `Etapa 1`, teams, matchs, order: 1, isManual: draftType }];
        }
        setTourneyData(cloneDeep(tourney));
    };

    const updateMatchDate = (date, match, groupName) => {
        const groupIndex = tourney.knockout.findIndex((x) => x.name === groupName);
        const matchIndex = tourney.knockout[groupIndex].matchs.findIndex((x) => x.matchOrder === match.matchOrder && x.week === match.week);
        tourney.knockout[groupIndex].matchs[matchIndex].date = date;
        setTourneyData({ ...tourney });
    };

    const handleDeleteStage = () => {
        const newData = cloneDeep(tourney);
        newData.knockout.pop();
        setTourneyData(newData);
        setDeleteModal(false);
    };

    const goToMatchDetails = (match, e) => {
        setPosToScroll(e.pageY - 100);
        setMatchDetails(match);
        dispatch(navbarNewEntry({ action: setMatchDetails, param: false }));
    };

    const renderNewStageBtn = () => {
        const lastStage = last(tourney.knockout);
        if (lastStage.matchs.length > 1 && lastStage.matchs.every((x) => x.winner)) {
            return (
                <Button
                    className="knockout-config-content-next-stage"
                    onClick={() => {
                        totalGroups === 1 ? singleGroupStage() : doubleGroupStage();
                    }}
                >
                    Siguiente etapa
                </Button>
            );
        }
    };

    const singleGroupStage = () => {
        const isManual = draftType === 'manual';
        const lastStage = last(tourney.knockout);
        const matches = lastStage.matchs;
        const winners = matches.map((x) => x.winner);
        if (winners.length % 2) {
            const losers = matches.flatMap((m) => m.teams.filter((t) => t._id !== m.winner)).map((x) => x._id);
            const bestOfLosers = tourney.groups[0].table.find((x) => losers.includes(x._id));
            winners.push(bestOfLosers._id);
        }
        const shuffledTeams = shuffle(winners);
        const nextStageMatchs = [];
        const nextOrder = lastStage.order + 1;
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const teamA = teamList.find((x) => x._id === shuffledTeams[i]);
            const teamB = teamList.find((x) => x._id === shuffledTeams[i + 1]);
            nextStageMatchs.push({
                week: nextOrder,
                matchOrder: i / 2 + 1,
                teams: [isManual ? MOCKED_TEAM : teamA, isManual ? MOCKED_TEAM : teamB],
                details: [],
                winner: null,
            });
        }

        const newData = cloneDeep(tourney);
        newData.knockout.push({
            name: `Etapa ${nextOrder}`,
            teams: teamList.filter((x) => winners.includes(x._id)),
            matchs: nextStageMatchs,
            order: nextOrder,
        });
        setTourneyData(newData);
    };

    const doubleGroupStage = () => {
        const isManual = draftType === 'manual';
        const getRandomInt = (max) => Math.floor(Math.random() * max);

        const lastStage = last(tourney.knockout);
        const matches = lastStage.matchs;
        const initialWinners = matches.map((x) => x.winner);
        const winners = [...initialWinners];
        let random = -1;
        if (winners.length % 2) {
            let randomWinner;
            const previousDirect = matches.find((m) => m.teams.length === 1);
            do {
                randomWinner = winners[getRandomInt(winners.length)];
            } while (previousDirect?._id === randomWinner);

            random = winners.findIndex((x) => x === randomWinner);
        }

        const nextStageMatchs = [];
        const nextOrder = lastStage.order + 1;
        let matchOrder = 1;
        for (let i = 0; i < winners.length; ) {
            const teams = [];
            let skip = false;
            if (i === random || i + 1 === random) {
                teams.push(isManual ? MOCKED_TEAM : teamList.find((x) => x._id === winners[random]));
                teams.push({
                    _id: '65012bf767e463f4f47fe668',
                    name: 'Clasificado directo',
                });
                skip = true;
                winners.splice(random, 1);
                random = -1;
            } else {
                teams.push(isManual ? MOCKED_TEAM : teamList.find((x) => x._id === winners[i]));
                teams.push(isManual ? MOCKED_TEAM : teamList.find((x) => x._id === winners[i + 1]));
            }

            nextStageMatchs.push({
                week: nextOrder,
                matchOrder: matchOrder,
                teams: teams,
                details: [],
                winner: null,
            });
            i += skip ? 0 : 2;
            matchOrder++;
        }

        const newData = cloneDeep(tourney);
        newData.knockout.push({
            name: `Etapa ${nextOrder}`,
            teams: teamList.filter((x) => initialWinners.includes(x._id)),
            matchs: nextStageMatchs,
            order: nextOrder,
        });
        setTourneyData(newData);
    };

    const configMocked = (match, stage, mocked) => {
        setConfigTeams({
            groupId: stage.name,
            week: match.week,
            matchOrder: match.matchOrder,
            teams: stage.teams.filter((t) => !stage.matchs.flatMap((x) => x.teams.map((y) => y._id)).includes(t._id)),
            hasDirect: match.teams.some((x) => x._id === '65012bf767e463f4f47fe668'),
        });
        mocked ? setTeamSelectModal(true) : setDeleteModalTeams(true);
    };

    const handleManualTeamsDelete = () => {
        tourney.knockout.forEach((k) => {
            if (k.name === configTeamsModal.groupId) {
                const index = k.matchs.findIndex((x) => x.week === configTeamsModal.week && x.matchOrder === configTeamsModal.matchOrder);
                const hasDirect = k.matchs[index].teams.some((x) => x._id === '65012bf767e463f4f47fe668');
                k.matchs[index].teams = [
                    MOCKED_TEAM,
                    hasDirect
                        ? {
                              _id: '65012bf767e463f4f47fe668',
                              name: 'Clasificado directo',
                          }
                        : MOCKED_TEAM,
                ];
                k.matchs[index].date = null;
                k.matchs[index].details = [];
                k.matchs[index].winner = null;
            }
        });
        setTourneyData(cloneDeep(tourney));
        setConfigTeams({ groupId: null, week: null, matchOrder: null, teams: [] });
        setDeleteModalTeams(false);
    };

    const handleManualTeams = (newTeams) => {
        tourney.knockout.forEach((k) => {
            if (k.name === configTeamsModal.groupId) {
                const index = k.matchs.findIndex((x) => x.week === configTeamsModal.week && x.matchOrder === configTeamsModal.matchOrder);
                const hasDirect = k.matchs[index].teams.some((x) => x._id === '65012bf767e463f4f47fe668');
                k.matchs[index].teams = newTeams;
                k.matchs[index].winner = hasDirect ? newTeams.find((x) => x._id !== '65012bf767e463f4f47fe668')._id : null;
            }
        });
        setTourneyData(cloneDeep(tourney));
        setConfigTeams({ groupId: null, week: null, matchOrder: null, teams: [] });
        setTeamSelectModal(false);
    };

    return (
        <>
            {matchDetails ? (
                <MatchDetails match={matchDetails} setMatchDetails={setMatchDetails} getScore={getScore} isKnockout={true} />
            ) : tourney.knockout.length ? (
                <>
                    {tourney.knockout.map((stage, index) => {
                        const jornadas = [...new Set(stage.matchs.map((x) => x.week))];
                        return (
                            <Accordion
                                className="knockout-config-content-calendar-accordion"
                                key={stage.name}
                                alignIconRight
                                useChevronIcon
                                {...(index === tourney.knockout.length - 1 ? { ...accordionConf } : null)}
                            >
                                <AccordionTrigger className="knockout-config-content-calendar-accordion-trigger">
                                    {stage.name}
                                    {index + 1 === tourney.knockout.length && (
                                        <IconButton onClick={() => setDeleteModal(true)}>
                                            <Icon src={navigationIcClose} />
                                        </IconButton>
                                    )}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {jornadas.map((i) => (
                                        <div className="jornada-container" key={`week-${i}`}>
                                            <h4>{`Jornada ${i}`}</h4>
                                            <div className="jornada-container-cards">
                                                {stage.matchs
                                                    .filter((x) => x.week === i)
                                                    .map((x, index2) => (
                                                        <MatchCard
                                                            key={`match-card-${index2}`}
                                                            getScore={getScore}
                                                            goToMatchDetails={goToMatchDetails}
                                                            group={stage}
                                                            match={x}
                                                            generateMatchPdf={handlePdf}
                                                            updateMatchDate={updateMatchDate}
                                                            tourneyDate={tourney.createdOn}
                                                            disableBtn={index + 1 < tourney.knockout.length}
                                                            configMocked={configMocked}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </Accordion>
                        );
                    })}
                    {renderNewStageBtn()}
                </>
            ) : (
                <>
                    <FormField>
                        <Label>Configuración de cruces</Label>
                        <Select value={draftType} onChange={(e) => setDraftType(e)}>
                            <Option value={'random'}>Al azar</Option>
                            <Option value={'manual'}>Manual</Option>
                        </Select>
                    </FormField>
                    <div className="knockout-config-content-btn">
                        <Button type="button" onClick={addFirstStage}>
                            Crear calendario
                        </Button>
                    </div>
                </>
            )}
            <ManualTeamSelection show={teamSelectModal} onClose={() => setTeamSelectModal(false)} onSubmit={handleManualTeams} configTeamsModal={configTeamsModal} />
            <DeleteConfirmation show={deleteModal} onClose={() => setDeleteModal(false)} onSubmit={handleDeleteStage} message={'¿Seguro quieres eliminar esta etapa?'} />
            <DeleteConfirmation
                show={deleteModalTeams}
                onClose={() => setDeleteModalTeams(false)}
                onSubmit={handleManualTeamsDelete}
                message={'¿Seguro quieres eliminar los equipos?'}
            />
        </>
    );
};

const WinnerScreen = ({ winner }) => {
    const [isExploding, setIsExploding] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsExploding(false), 2000);
        const footer = document.querySelector('.tourney-details-footer');
        footer.style.visibility = 'hidden';
        return () => (footer.style.visibility = 'visible');
    }, []);

    const confettiConfig = {
        force: 0.6,
        duration: 2500,
        particleCount: 100,
        width: 750,
        height: 1000,
    };

    return (
        <>
            <div className="winner-img-container">
                <img src={trophyIcon} alt={'trophy-icon'} loading="lazy" />
                {isExploding && <ConfettiExplosion {...confettiConfig} className="winner-img-container-confetti" />}
                <h1>{winner}</h1>
            </div>
        </>
    );
};

export default KnockoutConfig;
