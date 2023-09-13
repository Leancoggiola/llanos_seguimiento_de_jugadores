import { cloneDeep, isEmpty, isEqual, last, omit, pick } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateMatchPdf } from '../../pdfs/matchPdf';
// Components
import { contentIcSave } from '../../assets/icons';
import Button from '../../commonComponents/Button';
import Icon from '../../commonComponents/Icon/Icon.js';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import GroupConfig from './GroupConfig/GroupConfig.js';
import KnockoutConfig from './KnockoutConfig/KnockoutConfig';
// Middleware
import { navbarBack } from '../../middleware/actions/navbarActions';
import { getTourneyDetailsRequest, putTourneyDetailsRequest, resetTourneyDetailsSuccess } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyDetails.scss';

const TourneyDetails = (props) => {
    const { tourney, option } = props;

    const [tourneyData, setTourneyData] = useState(null);
    const tourneyDetails = useSelector((state) => state.tourney.tourneyDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTourneyDetailsRequest(tourney._id));
        return () => {
            dispatch(resetTourneyDetailsSuccess());
        };
    }, []);

    useEffect(() => {
        if (!isEmpty(tourneyDetails.data)) setTourneyData(cloneDeep(tourneyDetails.data));
    }, [tourneyDetails.data]);

    useEffect(() => {
        if (tourneyData) {
            const newData = cloneDeep(tourneyData);
            newData.status = getStatus(newData?.groups, newData?.knockout);
            setTourneyData(newData);
        }
    }, [JSON.stringify(tourneyData?.groups)]);

    const getStatus = (groups = [], knockout = []) => {
        if (groups.length) {
            if (knockout.length) {
                const lastItem = last(knockout);
                if (lastItem.matchs.length === 1 && lastItem.matchs[0].winner) return 'Terminado';
            }
            return 'Jugando';
        }
        return 'Nuevo';
    };

    const enableSave = () => {
        const comparate = tourneyDetails.data ? tourneyDetails.data : tourney;
        return isEqual(comparate, tourneyData);
    };

    const handleSave = () => {
        const data = cleanPayload();
        dispatch(putTourneyDetailsRequest(data));
    };

    const cleanPayload = () => {
        let newPayload = cloneDeep(tourneyData);
        const selector = option === 'grupo' ? ['groups', 'configs', 'teams'] : ['knockout'];
        newPayload = pick(newPayload, ['_id', 'status', ...selector]);
        if (newPayload?.teams) {
            newPayload.teams = newPayload.teams.map((x) => x._id);
        }

        function matchClean(arr) {
            return arr.map((group) => ({
                ...group,
                isFinished: group.matchs.length && group.matchs.every((x) => x.winner),
                teams: group.teams.map((x) => x._id),
                matchs: group.matchs.map((match) => ({
                    ...match,
                    teams: match.teams.map((x) => x._id),
                    details: match.details.map((det) => ({ ...det, player: det.player?._id ?? null })),
                })),
            }));
        }

        if (newPayload?.groups) newPayload.groups = matchClean(newPayload.groups);
        if (newPayload?.knockout) newPayload.knockout = matchClean(newPayload.knockout);

        return newPayload;
    };

    const handlePdf = (match, group) => {
        generateMatchPdf(match, group, tourneyData, option);
    };

    const renderTab = () => {
        switch (option) {
            case 'grupo':
                return <GroupConfig tourney={tourneyData} setTourneyData={setTourneyData} handlePdf={handlePdf} />;
            case 'eliminatoria':
                return <KnockoutConfig tourney={tourneyData} setTourneyData={setTourneyData} handlePdf={handlePdf} />;
            default:
                return null;
        }
    };

    return (
        <section className="tourney-details">
            {!tourneyData || tourneyDetails.loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <article className="tourney-details-container">{renderTab()}</article>
                    <footer className="tourney-details-footer">
                        <Button type="button" variant="secondary" onClick={() => dispatch(navbarBack())}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" disabled={enableSave()} onClick={handleSave}>
                            Guardar
                            <Icon src={contentIcSave} />
                        </Button>
                    </footer>
                </>
            )}
        </section>
    );
};

export default TourneyDetails;
