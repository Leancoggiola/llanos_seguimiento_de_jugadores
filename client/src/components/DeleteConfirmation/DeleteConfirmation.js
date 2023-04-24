// Components
import Button from '../../commonComponents/Button';
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
                <Button type="button" variant="secondary" onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button variant="warn" type="button" onClick={onSubmit}>
                    Confirmar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteConfirmation;
