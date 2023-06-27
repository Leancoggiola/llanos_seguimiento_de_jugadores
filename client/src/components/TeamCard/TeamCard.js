import { capitalize } from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import { actionIcDelete, editorIcModeEdit, mapsIcDirectionsRun } from '../../assets/icons';
import { Card, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import DeleteConfirmation from '../DeleteConfirmation';
// Middleware
import { deleteTeamRequest } from '../../middleware/actions/teamActions';
// Styling
import './TeamCard.scss';

const TeamCard = (props) => {
    const { team, setSelectedTeam } = props;
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteTeamRequest({ id: team._id }));
        setShowModal(false);
    };

    return (
        <Card className="team-card">
            <CardHeader className="team-card-header">
                <h2>{capitalize(team.name)}</h2>
                <div className="team-card-header-player-count">
                    <Icon src={mapsIcDirectionsRun} />
                    <span>{team.players.length}</span>
                </div>
                <div className="team-card-header-actions">
                    <IconButton onClick={() => setSelectedTeam(team)}>
                        <Icon src={editorIcModeEdit} />
                    </IconButton>
                    <IconButton onClick={() => setShowModal(true)}>
                        <Icon src={actionIcDelete} />
                    </IconButton>
                </div>
            </CardHeader>
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete} message={'¿Seguro quieres eliminar este equipo?'} className={'confirmation-modal'} />
        </Card>
    );
};

export default TeamCard;
