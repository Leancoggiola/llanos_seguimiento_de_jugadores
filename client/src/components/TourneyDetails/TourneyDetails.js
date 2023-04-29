import { useState } from 'react';
// Components
import { contentIcSave } from '../../assets/icons';
import Button from '../../commonComponents/Button';
import Icon from '../../commonComponents/Icon/Icon.js';
import GroupConfig from './GroupConfig/GroupConfig.js';
// Middleware
// Styling
import './TourneyDetails.scss';

const TourneyDetails = (props) => {
    const { tourney, option, onClose, setOption } = props;

    const [tourneyData, setTourneyData] = useState(tourney);

    const enableSave = () => {
        return JSON.stringify(tourney) === JSON.stringify(tourneyData);
    };

    const renderTab = () => {
        switch (option) {
            case 'grupo':
                return <GroupConfig tourney={tourneyData} setTourneyData={setTourneyData} />;
            case 'grupo':
                return <></>;
            case 'grupo':
                return <></>;
            default:
                return null;
        }
    };

    return (
        <section className="tourney-details">
            <article className="tourney-details-container">{renderTab()}</article>
            <footer className="tourney-details-footer">
                <Button type="button" variant="secondary">
                    Cancelar
                </Button>
                <Button type="button" variant="primary" disabled={enableSave()}>
                    Guardar
                    <Icon src={contentIcSave} />
                </Button>
            </footer>
        </section>
    );
};

export default TourneyDetails;
