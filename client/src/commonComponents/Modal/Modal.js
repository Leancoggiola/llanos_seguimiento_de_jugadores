import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext, ModalProvider } from '../contexts';
import FocusTrap from 'focus-trap-react';

// Components
import { navigationIcClose } from '../../assets/icons';
import Icon from '../Icon';
import IconButton from '../IconButton';
// Styling
import './Modal.scss';

const Modal = (props) => {
    const { children, className, show, onClose } = props;
    
    const closeModal = () => {
        onClose()
        document.body.style.overflow = '';
    }

    useEffect(()=> {
        document.body.style.overflow = show ? 'hidden' : '';
    }, [show])

    const classes = `cc-modal-dialog-container ${className ? className: ''}`;

    return (
        <ModalProvider value={{closeModal}}>
            {show && <Portal>
                <div className='cc-modal'>
                    <FocusTrap active={true} paused={false} focusTrapOptions={{}}>
                        <div role='dialog' className={classes}>
                            {children}
                        </div>
                    </FocusTrap>
                </div>
            </Portal>}
        </ModalProvider>
    )
}

const ModalHeader = (props) => {
    const { children, className, closeModalButton } = props;
    const modal = useContext(ModalContext)

    const handleClick = (e) => {
        modal.closeModal();
    }
    
    const classes = `cc-modal-header ${className ? className: ''}`;

    return (
        <div className={classes}>
            <h2 className='cc-modal-header-headline'>{children}</h2>
            {closeModalButton ? 
            <div>{closeModalButton}</div>
            :
            <IconButton type='button' onClick={handleClick} >
                <Icon className={'cc-modal-header-close-btn'} src={navigationIcClose} />
            </IconButton>}
        </div>
    )
}

const ModalBody = (props) => {
    const { children, className } = props;

    return (
        <div className={`cc-modal-body ${className ? className: ''}`}>
            {children}
        </div>
    )
}

const ModalFooter = (props) => {
    const { children, className } = props;

    return (
        <div className={`cc-modal-footer ${className ? className: ''}`}>
            {children}
        </div>
    )
}

const createModalRoot = () => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    modalRoot.setAttribute('class', 'modal-root')
    document.body.appendChild(modalRoot)
    return modalRoot;
}

const Portal = ({children}) => {
    const [ modalRoot, setModalRoot ] = useState();

    // layoutEffect to avoid create duplicates
    useLayoutEffect(() => {
        let newModal = document.getElementById('modal');
        let justCreated = false;
        if(!newModal) {
            newModal = createModalRoot();
            justCreated = true
        }
        setModalRoot(newModal);
        return () => {
            if(justCreated && newModal.parentNode) {
                newModal.parentNode.removeChild(newModal);
            }
        }
    }, [])

    if(!modalRoot) {
        return null
    }

    return createPortal(children, modalRoot)
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
