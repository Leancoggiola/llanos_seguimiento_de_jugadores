// Components
import { Modal, ModalBody } from '../../commonComponents/Modal';
// Styling
import './DeleteConfirmation.scss';

const DeleteConfirmation = (props) => {
    const { show, onClose, onSubmit, className } = props;

    return(
        <Modal show={show} onClose={onClose} className={`delete-modal ${className ? className : ''}`}>
            <ModalBody className='delete-modal-body'>
                <button type='button' className='delete-modal-body-delete-btn btn' onClick={onSubmit}>
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