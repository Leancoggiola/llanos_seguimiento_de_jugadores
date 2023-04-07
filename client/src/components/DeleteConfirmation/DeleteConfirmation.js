import { useDispatch, useSelector } from 'react-redux';
// Components
import { Modal, ModalBody } from '../../commonComponents/Modal';
// Middleware
import { deleteItemFromListRequest } from '../../middleware/actions/listActions';
// Styling
import './DeleteConfirmation.scss';

const DeleteConfirmation = (props) => {
    const { show, title, onClose, onSubmit, className } = props;
    const { data: userEmail } = useSelector((state) => state.auth);
    const dispatch = useDispatch()

    const handleDelete = () => {
        const postBody = { user: userEmail, name: title}
        dispatch(deleteItemFromListRequest(postBody))
        onSubmit()
    }

    return(
        <Modal show={show} onClose={onClose} className={`delete-modal ${className ? className : ''}`}>
            <ModalBody className='delete-modal-body'>
                <button type='button' className='delete-modal-body-delete-btn btn' onClick={handleDelete}>
                    Confirmar
                </button>
                <button type='button' className='btn-secondary btn' onClick={() => onClose()}>
                    Cancelar
                </button>
            </ModalBody>
        </Modal>
    )
}

export default DeleteConfirmation;