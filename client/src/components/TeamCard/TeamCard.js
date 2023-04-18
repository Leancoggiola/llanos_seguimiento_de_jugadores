import { capitalize } from 'lodash';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import { actionIcDelete, mapsIcDirectionsRun } from '../../assets/icons';
import { Card, CardHeader } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import DeleteConfirmation from '../DeleteConfirmation';
// Middleware
import { deleteTeamRequest } from '../../middleware/actions/teamActions';
// Styling
import './TeamCard.scss';

const TeamCard = (props) => {
    const { team: { name, players, _id } } = props;
    const [ showModal, setShowModal ] = useState(false)
    const dispatch = useDispatch()

    const handleDelete = () => {
        dispatch(deleteTeamRequest({postBody: _id}))
        setShowModal(false)
    }

    return (
        <Card className='team-card'>
            <CardHeader className='team-card-header'>
                <h2>{capitalize(name)}</h2>
                <div className='team-card-header-player-count'>
                    <Icon src={mapsIcDirectionsRun}/>
                    <span>{players.length}</span>
                </div>
                <div className='team-card-header-delete'>
                    <IconButton onClick={handleDelete} >
                        <Icon src={actionIcDelete}/>
                    </IconButton>
                </div>
            </CardHeader>
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete}/>
        </Card>
    )
}

export default TeamCard;