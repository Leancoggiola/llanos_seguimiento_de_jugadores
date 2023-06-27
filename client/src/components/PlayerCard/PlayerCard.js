import { capitalize } from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import { actionIcDelete, editorIcModeEdit } from '../../assets/icons';
import { Card, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import DeleteConfirmation from '../DeleteConfirmation';
// Middleware
import { deletePlayerRequest } from '../../middleware/actions/playerActions';
// Styling
import './PlayerCard.scss';

const PlayerCard = (props) => {
    const { player, setSelectedPlayer } = props;
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deletePlayerRequest({ id: player._id }));
        setShowModal(false);
    };

    return (
        <Card className="player-card">
            <CardHeader className="player-card-header">
                <h2>{capitalize(player.name)}</h2>
                <div className="player-card-header-actions">
                    <IconButton onClick={() => setSelectedPlayer(player)}>
                        <Icon src={editorIcModeEdit} />
                    </IconButton>
                    <IconButton onClick={() => setShowModal(true)}>
                        <Icon src={actionIcDelete} />
                    </IconButton>
                </div>
            </CardHeader>
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete} message={'¿Seguro quieres eliminar este jugador?'} className={'confirmation-modal'} />
        </Card>
    );
};

export default PlayerCard;
