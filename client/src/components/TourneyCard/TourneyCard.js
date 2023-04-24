import { useState } from 'react';
import { capitalize } from 'lodash';
// Components
import {
    contentIcKnockoutStage,
    editorIcBorderAll,
    editorIcFormatListNumbered,
} from '../../assets/icons';
import { Card, CardBody, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import { Pill } from '../../commonComponents/Pill';
// Middleware
// Styling
import './TourneyCard.scss';

const TourneyCard = (props) => {
    const { tourney, setSelectedTourney } = props;
    const [groupScreen, setGroupScreen] = useState(false);
    const [leagueScreen, setLeagueScreen] = useState(false);
    const [knockoutScreen, setKnockoutScreen] = useState(false);

    const getStatusVariant = () => {
        if ('Nuevo') return 'info';
        if ('Jugando') return 'success';
        return 'warning';
    };

    const getConfig = () => {
        const config = [];
        if (tourney.type.includes('Liga'))
            config.push({ func: setLeagueScreen, icon: editorIcFormatListNumbered });
        if (tourney.type.includes('Grupos'))
            config.push({ func: setGroupScreen, icon: editorIcBorderAll });
        if (tourney.type.includes('Eliminatoria'))
            config.push({ func: setKnockoutScreen, icon: contentIcKnockoutStage });
        return config;
    };

    return (
        <Card className="tourney-card">
            <CardHeader className="tourney-card-header" onClick={() => setSelectedTourney(tourney)}>
                <h2>{capitalize(tourney.name)}</h2>
                <Pill variant={getStatusVariant()}>{capitalize(tourney.status)}</Pill>
            </CardHeader>
            <CardBody className="tourney-card-body">
                <div className="tourney-card-body-formats">
                    <p>
                        <strong>Formato: </strong>
                        {tourney.type}
                    </p>
                    <div className="tourney-card-body-formats-icons">
                        {getConfig().map((x, index) => (
                            <IconButton key={index} onClick={() => x.func(true)} tourney={tourney}>
                                <Icon src={x.icon} />
                            </IconButton>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default TourneyCard;
