import { capitalize, cloneDeep, isEmpty, shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcTeam, editorIcFormatListNumbered, notificationIcEventNote, avIcEqualizer } from '../../../assets/icons';
import { Accordion, AccordionContent, AccordionTrigger } from '../../../commonComponents/Accordion';
import Button from '../../../commonComponents/Button';
import FormField from '../../../commonComponents/FormField';
import Icon from '../../../commonComponents/Icon';
import Input from '../../../commonComponents/Input';
import Label from '../../../commonComponents/Label';
import List from '../../../commonComponents/List';
import { Option, Select } from '../../../commonComponents/Select';
import { TabControl, TabNavigator } from '../../../commonComponents/TabNavigator';
import Table from '../../../commonComponents/Table';
import DeleteConfirmation from '../../DeleteConfirmation';
import ManualForm from '../../ManualForm';
import ManualTeamSelection from '../../ManualTeamSelection';
import MatchCard from '../MatchCard/MatchCard';
import MatchDetails from '../MatchDetails/MatchDetails';
import TopMetricsTable from '../../TopMetricsTable';
// Middleware
import { navbarNewEntry, updateToastData } from '../../../middleware/actions/navbarActions';
// Styling
import './GroupConfig.scss';

const orderGroupTable = (a, b) => {
    if (a.pts > b.pts) {
        return -1;
    } else if (a.pts < b.pts) {
        return 1;
    } else {
        const valuesA = a['ga/gc'].split(':');
        const valuesB = b['ga/gc'].split(':');
        const diferenciaA = Number(valuesA[0]) - Number(valuesA[1]);
        const diferenciaB = Number(valuesB[0]) - Number(valuesB[1]);
        if (diferenciaA > diferenciaB) {
            return -1;
        } else if (diferenciaA < diferenciaB) {
            return 1;
        } else {
            return a.dif - b.dif;
        }
    }
};

const formatGroupTable = (group) => {
    const getTable = (team) => {
        const results = { pj: 0, pg: 0, pe: 0, pp: 0, 'ga/gc': '0:0', dif: 0, pts: 0 };
        const matches = group.matchs.filter((x) => x.teams.map((x) => x._id).includes(team._id));
        results['_id'] = team._id;
        results.pj = matches.filter((x) => x.winner).length;
        results.pg = matches.filter((x) => x.winner && x.winner !== 'empate' && x.winner === team._id).length;
        results.pe = matches.filter((x) => x.winner && x.winner === 'empate').length;
        results.pp = matches.filter((x) => x.winner && x.winner !== 'empate' && x.winner !== team._id).length;
        results.pts = results.pg * 3 + results.pe * 1;
        results['ga/gc'] = matches
            .reduce(
                (prev, curr) => {
                    if (!isEmpty(curr.details)) {
                        const ga = curr.details.filter((det) => det.type === 'gol' && team.players.some((play) => play._id === det.player._id)).length;
                        const gc = curr.details.filter((det) => det.type === 'gol' && team.players.every((play) => play._id !== det.player._id)).length;
                        prev = [prev[0] + ga, prev[1] + gc];
                    }
                    return prev;
                },
                [0, 0]
            )
            .join(':');
        results.dif = Number(results['ga/gc'].split(':')[0]) - Number(results['ga/gc'].split(':')[1]);
        return results;
    };

    return group.teams.map((team) => ({
        name: capitalize(team.name),
        ...getTable(team),
    }));
};

const MOCKED_TEAM = {
    name: 'Desconocido',
    players: [],
    hidden: true,
    mocked: true,
};

const GroupConfig = (props) => {
    const { tourney, setTourneyData, handlePdf } = props;
    const [tabIndex, setTabIndex] = useState(0);

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

    return (
        <div className="group-config">
            <TabNavigator defaultActiveKey={tabIndex} className="group-config-navigator">
                <TabControl onClick={() => setTabIndex(0)}>
                    <Icon src={contentIcTeam} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(1)} disabled={isEmpty(tourney.teams)}>
                    <Icon src={editorIcFormatListNumbered} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(2)} disabled={isEmpty(tourney.groups)}>
                    <Icon src={notificationIcEventNote} />
                </TabControl>
                <TabControl onClick={() => setTabIndex(3)}>
                    <Icon src={avIcEqualizer} />
                </TabControl>
            </TabNavigator>
            <div className="group-config-content">
                {tabIndex === 0 && <Equipos tourney={tourney} setTourneyData={setTourneyData} />}
                {tabIndex === 1 && <Grupos tourney={tourney} setTourneyData={setTourneyData} getScore={getScore} />}
                {tabIndex === 2 && <Calendario tourney={tourney} setTourneyData={setTourneyData} getScore={getScore} handlePdf={handlePdf} />}
                {tabIndex === 3 && <TopMetricsTable tourney={tourney} />}
            </div>
        </div>
    );
};

const Equipos = ({ tourney, setTourneyData }) => {
    const teamList = useSelector((state) => state.team.teamList);
    const tourneyList = useSelector((state) => state.tourney.tourneyList);

    const [equipoDrop, setDrop] = useState(tourney?.teams.map((x) => x._id));

    const handleChange = (e) => {
        const newData = cloneDeep(tourney);
        newData.teams = e.map((x) => teamList.data.find((y) => y._id === x));
        setDrop(e);
        setTourneyData(newData);
    };

    return (
        <div className="group-config-content-teams">
            <h3>Equipos en el torneo</h3>
            <FormField>
                <Label>Equipos</Label>
                <Select value={equipoDrop} onChange={(e) => handleChange(e)} filter={true} multiple={true} disabled={tourney.groups.length}>
                    {teamList.data
                        .filter((team) => {
                            if (team.tourney_ids.includes(tourney?._id)) return true;
                            return !tourneyList.data.some((x) => team.tourney_ids.includes(x._id) && x?.status !== 'Terminado');
                        })
                        .map((option, index) => (
                            <Option value={option._id} key={option._id + index}>
                                {capitalize(option.name)}
                            </Option>
                        ))}
                </Select>
            </FormField>
            <List>
                {tourney?.teams.map((equipo, index) => (
                    <p key={equipo._id + index}>{capitalize(equipo.name)}</p>
                ))}
            </List>
        </div>
    );
};

const Grupos = ({ tourney, setTourneyData }) => {
    const { groupConfig } = useSelector((state) => state.auth);

    const [deleteModal, setDeleteModal] = useState(false);
    const [manualModal, setManualModal] = useState(false);

    const [totalGroups, setTotalGroups] = useState(groupConfig?.totalGroups ? groupConfig.totalGroups : '1');
    const [enconters, setEnconters] = useState(groupConfig?.enconters ? groupConfig.enconters : '1');
    const [winPnts, setWinPnts] = useState(groupConfig?.winPnts ? groupConfig.winPnts : '3');
    const [drawPnts, setDrawPnts] = useState(groupConfig?.drawPnts ? groupConfig.drawPnts : '1');
    const [losePnts, setLosePnts] = useState(groupConfig?.losePnts ? groupConfig.losePnts : '0');
    const [nextStepRules, setNextStepRules] = useState(groupConfig?.nextStepRules ? groupConfig.nextStepRules : 'Total');
    const [draftType, setDraftType] = useState(groupConfig?.draftType ? groupConfig.draftType : 'random');

    const dispath = useDispatch();

    const isDisabled = () => {
        return !totalGroups || !enconters || !winPnts || !drawPnts || !losePnts || !nextStepRules || !draftType;
    };

    const randomGroupSort = () => {
        const totalTeams = tourney.teams.length;
        if (totalTeams < totalGroups * 2) {
            dispath(
                updateToastData({
                    show: true,
                    variant: 'error',
                    message: 'No hay suficientes equipos para la cantidad de grupos seleccionada',
                    closeBtn: true,
                })
            );
            return;
        }

        const teamsToSort = [...tourney.teams];
        const groups = Array.from({ length: totalGroups }, (_, i) => ({
            name: `Grupo ${String.fromCharCode(65 + i)}`,
            teams: [],
            matchs: [],
            table: [],
        }));
        do {
            for (let i = 0; i < groups.length; i++) {
                if (teamsToSort.length === 0) break;
                groups[i].teams.push(...teamsToSort.splice(Math.floor(Math.random() * teamsToSort.length), 1));
            }
        } while (teamsToSort.length > 0);

        tourney.groups = groups;
        tourney.groups.forEach((group) => {
            group.table = formatGroupTable(group).sort(orderGroupTable);
        });
        tourney.configs = tourney?.configs ? tourney.configs : {};
        tourney.configs['group'] = {
            totalGroups,
            enconters,
            winPnts,
            drawPnts,
            losePnts,
            nextStepRules,
            draftType,
        };
        setTourneyData(cloneDeep(tourney));
    };

    const manualGroupSort = () => {
        if (Number(totalGroups) === 1) {
            randomGroupSort();
        } else {
            setManualModal(true);
        }
    };

    const columnDefs = [
        { headerName: '#', field: 'position', numered: true },
        { headerName: 'Nombre', field: 'name', style: { width: '100%' } },
        { headerName: 'J', field: 'pj' },
        { headerName: 'G', field: 'pg' },
        { headerName: 'E', field: 'pe' },
        { headerName: 'P', field: 'pp' },
        { headerName: '+/-', field: 'ga/gc' },
        { headerName: 'Dif', field: 'dif' },
        { headerName: 'Pts', field: 'pts' },
    ];

    const handleManualGroups = (groups) => {
        setManualModal(false);
        tourney.groups = groups;
        tourney.groups.forEach((group) => {
            group.table = formatGroupTable(group).sort(orderGroupTable);
        });
        tourney.configs = tourney?.configs ? tourney.configs : {};
        tourney.configs['group'] = {
            totalGroups,
            enconters,
            winPnts,
            drawPnts,
            losePnts,
            nextStepRules,
            draftType,
        };
        setTourneyData(cloneDeep(tourney));
    };

    const handleDeleteGroups = () => {
        setTourneyData({
            ...tourney,
            groups: [],
        });
        setDeleteModal(false);
    };

    return (
        <>
            {tourney.groups.length > 0 ? (
                <div className="group-config-content-groups">
                    {tourney.groups.map((group, index) => (
                        <div key={group.name + index} className="group-config-content-group-card">
                            <h3>{group.name}</h3>
                            <Table columnDefs={columnDefs} dataSource={group.table} />
                        </div>
                    ))}
                    {!tourney.knockout.length && (
                        <div className="group-config-content-delete-btn">
                            <Button type="button" onClick={() => setDeleteModal(true)} variant="warn">
                                Eliminar grupos
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <form noValidate>
                        <FormField>
                            <Label>Número de grupos</Label>
                            <Input type="number" min={0} max={2} required={true} value={totalGroups} onChange={(e) => setTotalGroups(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Número de encuentros</Label>
                            <Input type="number" min={0} max={5} required={true} value={enconters} onChange={(e) => setEnconters(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Puntos por victoria</Label>
                            <Input type="number" min={0} max={9} required={true} value={winPnts} onChange={(e) => setWinPnts(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Puntos por empate</Label>
                            <Input type="number" min={0} max={9} required={true} value={drawPnts} onChange={(e) => setDrawPnts(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Puntos por derrota</Label>
                            <Input type="number" min={0} max={9} required={true} value={losePnts} onChange={(e) => setLosePnts(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Reglas de clasificación</Label>
                            <Input type="text" required={true} disabled={true} value={nextStepRules} onChange={(e) => setNextStepRules(e.target.value)} />
                        </FormField>
                        <FormField>
                            <Label>Sorteo de grupos</Label>
                            <Select value={draftType} onChange={(e) => setDraftType(e)}>
                                <Option value={'random'}>Al azar</Option>
                                <Option value={'manual'}>Manual</Option>
                            </Select>
                        </FormField>
                    </form>
                    <div className="group-config-content-btn">
                        <Button
                            type="button"
                            disabled={isDisabled()}
                            onClick={() => {
                                draftType === 'random' ? randomGroupSort() : manualGroupSort();
                            }}
                        >
                            Crear
                        </Button>
                    </div>
                </>
            )}
            <ManualForm show={manualModal} onClose={() => setManualModal(false)} onSubmit={handleManualGroups} groupsTotal={totalGroups} teams={tourney.teams} />
            <DeleteConfirmation show={deleteModal} onClose={() => setDeleteModal(false)} onSubmit={handleDeleteGroups} message={'¿Seguro quieres eliminar los grupos?'} />
        </>
    );
};

const Calendario = ({ tourney, setTourneyData, getScore, handlePdf }) => {
    const addCalendar = () => {
        const enconters = tourney.configs.group.enconters;

        tourney.groups.forEach((group) => {
            const teamsToPlay = shuffle(group.teams);
            if (teamsToPlay.length % 2 !== 0) {
                teamsToPlay.push('ODD');
            }
            const half = teamsToPlay.length / 2;
            let matchs = [];

            if (draftType === 'manual') {
                for (let enc = 0; enc < enconters; enc++) {
                    for (let i = 0; i < teamsToPlay.length - 1; i++) {
                        const local = teamsToPlay.slice(0, half);
                        const visitante = teamsToPlay.slice(half).reverse();
                        teamsToPlay.splice(1, 0, teamsToPlay.pop());

                        for (let j = 0; j < half; j++) {
                            if (local[j] && visitante[j]) {
                                const a = local[j] === 'ODD' ? local[j] : MOCKED_TEAM;
                                const b = visitante[j] === 'ODD' ? visitante[j] : MOCKED_TEAM;
                                matchs.push({
                                    week: i + 1 + (teamsToPlay.length - 1) * enc,
                                    matchOrder: j + 1,
                                    teams: enc % 2 !== 0 ? [b, a] : [a, b],
                                    details: [],
                                    winner: null,
                                });
                            }
                        }
                    }
                }
            } else {
                for (let enc = 0; enc < enconters; enc++) {
                    for (let i = 0; i < teamsToPlay.length - 1; i++) {
                        const local = teamsToPlay.slice(0, half);
                        const visitante = teamsToPlay.slice(half).reverse();
                        teamsToPlay.splice(1, 0, teamsToPlay.pop());

                        for (let j = 0; j < half; j++) {
                            if (local[j] && visitante[j]) {
                                matchs.push({
                                    week: i + 1 + (teamsToPlay.length - 1) * enc,
                                    matchOrder: j + 1,
                                    teams: enc % 2 !== 0 ? [visitante[j], local[j]] : [local[j], visitante[j]],
                                    details: [],
                                    winner: null,
                                });
                            }
                        }
                    }
                }
            }

            group.matchs = matchs.filter((x) => !x.teams.includes('ODD')).sort((a, b) => a.week - b.week);
        });
        setTourneyData(cloneDeep(tourney));
    };

    const dispatch = useDispatch();

    const [matchDetails, setMatchDetails] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalTeams, setDeleteModalTeams] = useState(false);
    const [teamSelectModal, setTeamSelectModal] = useState(false);
    const [configTeamsModal, setConfigTeams] = useState({ groupId: null, week: null, matchOrder: null, teams: [] });
    const [posToScroll, setPosToScroll] = useState();
    const [draftType, setDraftType] = useState('random');

    const goToMatchDetails = (match) => {
        setPosToScroll(window.scrollY);
        setMatchDetails(match);
        dispatch(navbarNewEntry({ action: setMatchDetails, param: false }));
    };

    useEffect(() => {
        if (matchDetails) {
            tourney.groups.forEach((g) => {
                g.matchs.forEach((m) => {
                    if (m.matchOrder === matchDetails.matchOrder && m.week === matchDetails.week && g.name === matchDetails.groupName) {
                        m.details = [...matchDetails.details];
                        if (!isEmpty(m.details)) {
                            const results = getScore(m).split(':').map(Number);
                            m.winner = results[0] === results[1] ? 'empate' : results[0] > results[1] ? m.teams[0]._id : m.teams[1]._id;
                        } else {
                            m.winner = null;
                            m.date = null;
                        }
                    }
                });
                g.table = formatGroupTable(g).sort(orderGroupTable);
            });
            setTourneyData(cloneDeep(tourney));
        } else {
            posToScroll && window.scrollTo(0, posToScroll);
        }
    }, [matchDetails]);

    const updateMatchDate = (date, match, groupName) => {
        const groupIndex = tourney.groups.findIndex((x) => x.name === groupName);
        const matchIndex = tourney.groups[groupIndex].matchs.findIndex((x) => x.matchOrder === match.matchOrder && x.week === match.week);
        tourney.groups[groupIndex].matchs[matchIndex].date = date;
        setTourneyData({ ...tourney });
    };

    const configMocked = (match, group, mocked) => {
        setConfigTeams({
            groupId: group.name,
            week: match.week,
            matchOrder: match.matchOrder,
            teams: group.teams,
        });
        mocked ? setTeamSelectModal(true) : setDeleteModalTeams(true);
    };

    const handleDeleteCalendar = () => {
        setTourneyData({
            ...tourney,
            groups: tourney.groups.map((x) => ({ ...x, matchs: [] })),
        });
        setDeleteModal(false);
    };

    const handleManualTeamsDelete = () => {
        tourney.groups.forEach((g) => {
            if (g.name === configTeamsModal.groupId) {
                const index = g.matchs.findIndex((x) => x.week === configTeamsModal.week && x.matchOrder === configTeamsModal.matchOrder);
                g.matchs[index].teams = [MOCKED_TEAM, MOCKED_TEAM];
                g.matchs[index].date = null;
                g.matchs[index].details = [];
                g.matchs[index].winner = null;
                g.table = formatGroupTable(g).sort(orderGroupTable);
            }
        });
        setTourneyData(cloneDeep(tourney));
        setConfigTeams({ groupId: null, week: null, matchOrder: null, teams: [] });
        setDeleteModalTeams(false);
    };

    const handleManualTeams = (newTeams) => {
        tourney.groups.forEach((g) => {
            if (g.name === configTeamsModal.groupId) {
                const index = g.matchs.findIndex((x) => x.week === configTeamsModal.week && x.matchOrder === configTeamsModal.matchOrder);
                g.matchs[index].teams = newTeams;
            }
        });
        setTourneyData(cloneDeep(tourney));
        setConfigTeams({ groupId: null, week: null, matchOrder: null, teams: [] });
        setTeamSelectModal(false);
    };

    return (
        <>
            {matchDetails ? (
                <MatchDetails match={matchDetails} setMatchDetails={setMatchDetails} getScore={getScore} />
            ) : tourney.groups.every((x) => x.matchs.length > 0) ? (
                <>
                    {tourney.groups.map((group, index) => {
                        const jornadas = [...new Set(group.matchs.map((x) => x.week))];
                        return (
                            <Accordion className="group-config-content-calendar-accordion" key={group.name} alignIconRight useChevronIcon>
                                <AccordionTrigger>{group.name}</AccordionTrigger>
                                <AccordionContent>
                                    {jornadas.map((i) => (
                                        <div className="jornada-container" key={`week-${i}`}>
                                            <h4>{`Jornada ${i}`}</h4>
                                            <div className="jornada-container-cards">
                                                {group.matchs
                                                    .filter((x) => x.week === i)
                                                    .map((x, index) => (
                                                        <MatchCard
                                                            match={x}
                                                            getScore={getScore}
                                                            goToMatchDetails={goToMatchDetails}
                                                            key={`match-card-${index}`}
                                                            group={group}
                                                            generateMatchPdf={handlePdf}
                                                            updateMatchDate={updateMatchDate}
                                                            tourneyDate={tourney.createdOn}
                                                            isFinished={tourney.knockout.length > 0}
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
                    {!tourney.knockout.length && (
                        <div className="group-config-content-delete-btn">
                            <Button type="button" onClick={() => setDeleteModal(true)} variant="warn">
                                Eliminar calendario
                            </Button>
                        </div>
                    )}
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
                    <div className="group-config-content-btn">
                        <Button type="button" onClick={addCalendar}>
                            Crear calendario
                        </Button>
                    </div>
                </>
            )}
            <ManualTeamSelection show={teamSelectModal} onClose={() => setTeamSelectModal(false)} onSubmit={handleManualTeams} configTeamsModal={configTeamsModal} />
            <DeleteConfirmation show={deleteModal} onClose={() => setDeleteModal(false)} onSubmit={handleDeleteCalendar} message={'¿Seguro quieres eliminar el calendario?'} />
            <DeleteConfirmation
                show={deleteModalTeams}
                onClose={() => setDeleteModalTeams(false)}
                onSubmit={handleManualTeamsDelete}
                message={'¿Seguro quieres eliminar los equipos?'}
            />
        </>
    );
};

export default GroupConfig;
