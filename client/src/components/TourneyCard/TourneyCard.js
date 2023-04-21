import { capitalize } from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import {
    actionIcDelete,
    contentIcAdd,
    contentIcKnockoutStage,
    editorIcBorderAll,
    editorIcFormatListNumbered,
    editorIcModeEdit,
} from '../../assets/icons';
import { Card, CardBody, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import { Pill } from '../../commonComponents/Pill';
import DeleteConfirmation from '../DeleteConfirmation';
// Middleware
import { deleteTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyCard.scss';

const TourneyCard = (props) => {
    const { tourney, setSelectedTourney } = props;
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const getStatusVariant = () => {
        if ('Nuevo') return 'info';
        if ('Jugando') return 'success';
        return 'warning';
    };

    const getIcons = () => {
        const icons = [];
        if (tourney.type.includes('Liga')) icons.push(editorIcFormatListNumbered);
        if (tourney.type.includes('Grupos')) icons.push(editorIcBorderAll);
        if (tourney.type.includes('+')) icons.push(contentIcAdd);
        if (tourney.type.includes('Eliminatoria')) icons.push(contentIcKnockoutStage);
        return icons;
    };

    const handleDelete = () => {
        dispatch(deleteTourneyRequest({ body: tourney._id }));
        setShowModal(false);
    };

    return (
        <Card className="tourney-card">
            <CardHeader className="tourney-card-header">
                <h2>{capitalize(tourney.name)}</h2>
                <Pill variant={getStatusVariant()}>{capitalize(tourney.status)}</Pill>
            </CardHeader>
            <CardBody className="tourney-card-body">
                <div className="tourney-card-body-formats">
                    <p>
                        <strong>Formato: </strong>
                        {tourney.type}
                    </p>
                    <div>
                        {getIcons().map((x, index) => (
                            <Icon key={index} src={x} />
                        ))}
                    </div>
                </div>
                <div className="tourney-card-header-actions">
                    <IconButton onClick={() => setSelectedTourney(tourney)}>
                        <Icon src={editorIcModeEdit} />
                    </IconButton>
                    <IconButton onClick={() => setShowModal(true)}>
                        <Icon src={actionIcDelete} />
                    </IconButton>
                </div>
            </CardBody>
            <DeleteConfirmation
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleDelete}
                message={'¿Seguro quieres eliminar este torneo?'}
                className={'confirmation-modal'}
            />
        </Card>
    );
};

export default TourneyCard;
