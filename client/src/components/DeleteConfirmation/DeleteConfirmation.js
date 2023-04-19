// Components
import { Modal, ModalBody, ModalFooter } from '../../commonComponents/Modal';
// Styling
import './DeleteConfirmation.scss';

const DeleteConfirmation = (props) => {
    const { show, onClose, onSubmit, message = '', className } = props;

    return (
        <Modal
            show={show}
            onClose={onClose}
            className={`delete-modal ${className ? className : ''}`}
        >
            {message && (
                <ModalBody>
                    <h3>{message}</h3>
                </ModalBody>
            )}
            <ModalFooter className="delete-modal-body">
                <button
                    type="button"
                    className="delete-modal-body-delete-btn btn"
                    onClick={onSubmit}
                >
                    Confirmar
                </button>
                <button type="button" className="btn-secondary btn" onClick={() => onClose()}>
                    Cancelar
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteConfirmation;
