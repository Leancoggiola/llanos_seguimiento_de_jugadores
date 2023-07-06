import { cloneDeep, isEmpty, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcSave } from '../../assets/icons';
import Button from '../../commonComponents/Button';
import Icon from '../../commonComponents/Icon/Icon.js';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import GroupConfig from './GroupConfig/GroupConfig.js';
// Middleware
import { navbarBack } from '../../middleware/actions/navbarActions';
import { getTourneyDetailsRequest, putTourneyDetailsRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyDetails.scss';

const TourneyDetails = (props) => {
    const { tourney, option } = props;

    const [tourneyData, setTourneyData] = useState(null);
    const tourneyDetails = useSelector((state) => state.tourney.tourneyDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!tourney.fullData) dispatch(getTourneyDetailsRequest(tourney._id));
    }, []);

    useEffect(() => {
        if (!isEmpty(tourneyDetails.data)) setTourneyData(cloneDeep(tourneyDetails.data));
    }, [tourneyDetails.data]);

    useEffect(() => {
        if (tourneyData) {
            const newData = cloneDeep(tourneyData);
            newData.status = newData?.groups.length ? 'Jugando' : 'Nuevo';
            setTourneyData(newData);
        }
    }, [JSON.stringify(tourneyData?.groups)]);

    const enableSave = () => {
        return isEqual(tourneyDetails.data, tourneyData);
    };

    const handleSave = () => {
        dispatch(putTourneyDetailsRequest(tourneyData));
    };

    const renderTab = () => {
        switch (option) {
            case 'grupo':
                return <GroupConfig tourney={tourneyData} setTourneyData={setTourneyData} />;
            case 'eliminatorias':
                return <></>;
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
