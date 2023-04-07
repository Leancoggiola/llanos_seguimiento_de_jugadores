import { useState } from 'react';
// Components
import { actionIcEdit, navigationIcClose } from '../../assets/icons';
import { Card, CardFooter, CardHeader, CardImage } from '../../commonComponents/Card';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import { Modal, ModalBody, ModalHeader } from '../../commonComponents/Modal';
import { Pill } from '../../commonComponents/Pill';
import ItemForm from '../ItemForm';
import StatusPill from '../StatusPill';
import DeleteConfirmation from '../DeleteConfirmation';
// Styling
import './ContentCard.scss';

const ContentCard = (props) => {
    const { item } = props;
    const [ showButtons, setShowButtons] = useState(false);
    const [ editModal, setEditModal ] = useState(false)
    const [ deleteModal, setDeleteModal ] = useState(false)

    return (
        <Card className='content-card' onMouseLeave={() => setShowButtons(false)} onMouseEnter={() => setShowButtons(true)}>
            <CardImage className='content-card-img'>
                <img src={item.imageUrl} alt={item.title+'portrait'} />
            </CardImage>
            <CardHeader className='content-card-header'>
                <span><b>{item.title}</b></span>
                <span>{item.type}</span>
            </CardHeader>
            <CardFooter className='content-card-footer'>
                <StatusPill className='content-card-footer-pill' status={item.status} />
                <Pill className='content-card-footer-pill'>{item.appDisplayName}</Pill>
            </CardFooter>
            <IconButton className={`content-card-btn content-card-btn-edit${!showButtons ? ' hidden' : ''}`} onClick={() => setEditModal(true)}>
                <Icon src={actionIcEdit}/>
            </IconButton>
            <IconButton className={`content-card-btn content-card-btn-remove${!showButtons ? ' hidden' : ''}`} onClick={() => setDeleteModal(true)}>
                <Icon src={navigationIcClose}/>
            </IconButton>

            <Modal show={editModal} onClose={() => setEditModal(false)} className='content-card-edit-modal'>
                <ModalHeader>Editar informacion</ModalHeader>
                <ModalBody>
                    <ItemForm onClose={() => setEditModal(false)} currentApp={item.appName} currentStatus={item.status} itemData={item} />
                </ModalBody>
            </Modal>
            <DeleteConfirmation show={deleteModal} onClose={() => setDeleteModal(false)} onSubmit={() => setDeleteModal(false)} title={item.title} />
        </Card>
    )
}

export default ContentCard;