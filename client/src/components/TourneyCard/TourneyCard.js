import { capitalize } from 'lodash';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
// Components
import { actionIcDelete, contentIcAdd, contentIcKnockoutStage, editorIcBorderAll, editorIcFormatListNumbered } from '../../assets/icons';
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
    const { tourney: { name, status, type, _id } } = props;
    const [ showModal, setShowModal ] = useState(false)
    const dispatch = useDispatch()

    const getStatusVariant = () => {
        if('Nuevo') return 'info';
        if('Jugando') return 'success';
        return 'warning'
    }

    const getIcons = () => {
        const icons = []
        if(type.includes('Liga')) icons.push(editorIcFormatListNumbered)
        if(type.includes('Grupos')) icons.push(editorIcBorderAll)
        if(type.includes('+')) icons.push(contentIcAdd)
        if(type.includes('Eliminatoria')) icons.push(contentIcKnockoutStage)
        return icons
    }

    const handleDelete = () => {
        dispatch(deleteTourneyRequest({postBody: _id}))
        setShowModal(false)
    }

    return (
        <Card className='tourney-card'>
            <CardHeader className='tourney-card-header'>
                <h2>{capitalize(name)}</h2>
                <Pill variant={getStatusVariant()}>{capitalize(status)}</Pill>
            </CardHeader>
            <CardBody className='tourney-card-body'>
                <div className='tourney-card-body-formats'>
                    <p><strong>Formato: </strong>{type}</p>
                    <div>{
                        getIcons().map((x,index) => <Icon key={index} src={x}/>)
                    }</div>
                </div>
                <IconButton onClick={() => setShowModal(true)} >
                    <Icon src={actionIcDelete}/>
                </IconButton>
            </CardBody>
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete}/>
        </Card>
    )
}

export default TourneyCard;