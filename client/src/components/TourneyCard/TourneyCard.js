import { useState } from 'react';
import { capitalize } from 'lodash';
// Components
import { contentIcKnockoutStage, editorIcBorderAll, editorIcFormatListNumbered } from '../../assets/icons';
import { Card, CardBody, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import { Pill } from '../../commonComponents/Pill';
// Middleware
// Styling
import './TourneyCard.scss';

const TourneyCard = (props) => {
    const { tourney, setSelectedTourney, setOption, setTourneyForm } = props;

    const handleDetails = (option) => {
        setSelectedTourney(tourney);
        setOption(option);
    };

    const handleEditTourney = () => {
        setSelectedTourney(tourney);
        setTourneyForm(true);
    };

    const getStatusVariant = () => {
        if (tourney.status === 'Nuevo') return 'info';
        if (tourney.status === 'Jugando') return 'success';
        return 'warning';
    };

    const getConfig = () => {
        const config = [];
        if (tourney.type.includes('Liga')) config.push({ func: () => handleDetails('liga'), icon: editorIcFormatListNumbered });
        if (tourney.type.includes('Grupos')) config.push({ func: () => handleDetails('grupo'), icon: editorIcBorderAll });
        if (tourney.type.includes('Eliminatoria'))
            config.push({
                func: () => handleDetails('eliminatoria'),
                icon: contentIcKnockoutStage,
                disabled: tourney.groups.some((x) => !x.isFinished) || tourney.groups.length === 0,
            });
        return config;
    };

    return (
        <Card className="tourney-card">
            <CardHeader className="tourney-card-header">
                <h2 onClick={() => handleEditTourney()}>{capitalize(tourney.name)}</h2>
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
                            <IconButton key={index} onClick={() => x.func(true)} tourney={tourney} disabled={x.disabled}>
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
