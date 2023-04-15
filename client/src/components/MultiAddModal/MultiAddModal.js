import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { capitalize } from 'lodash';
// Components
import {Modal, ModalHeader, ModalBody, ModalFooter} from '../../commonComponents/Modal';
import { TabControl, TabNavigator } from '../../commonComponents/TabNavigator';
import FormField from '../../commonComponents/FormField';
import Label from '../../commonComponents/Label';
import Input from '../../commonComponents/Input';
import Textarea from '../../commonComponents/Textarea';
// Middleware
import { updateToastData } from '../../middleware/actions/navbarActions';
// Styling
import './MultiAddModal.scss';

const MultiAddModal = (props) => {
    const { show, onClose, type, handleClose, names } = props;
    
    const title = capitalize(type);
    const plural = type === 'equipo' ? 's' : 'es'
    const [ total, setTotal ] = useState('1');
    const [ prefijo, setPrefijo ] = useState();
    const [ textarea, setTextarea ] = useState();
    const [ tabIndex, setTabIndex ] = useState(0);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault()
        let newList = []
        if(tabIndex === 0) {
            newList = Array.from({length: total}, (_, i) => `${prefijo ? prefijo : title} ${i+1}`);
        } else {
            newList = textarea.split('\n').filter(x => x)
        }
        if(validateNames(newList)) {
            handleClose(newList)
            onClose()
        } else {
            dispatch(updateToastData({show: true, variant: 'error', message: 'Uno o más equipos ya existen', closeBtn: false}))
        }
    }

    const validateNames = (newList) => {
        return !newList.some(x => names.includes(x))
    }

    const renderTab = () => {
        switch(tabIndex) {
            case(0):
                return (
                    <form noValidate>
                        <FormField>
                            <Label>Total de {type}{plural}</Label>
                            <Input type='number' value={total} onChange={(e)=> setTotal(e.target.value)} min='1' max='50'/>
                        </FormField>
                        <FormField>
                            <Label>Prefijo</Label>
                            <Input type='text' value={prefijo} onChange={(e)=> setPrefijo(e.target.value)} maxLength='10' placeholder={title}/>
                        </FormField>
                        <p><i><b>Por ejemplo: </b>{prefijo ? prefijo : title} 1, {prefijo ? prefijo : title} 2</i></p>
                    </form>
                )
            case(1):
                return (
                    <FormField>
                        <Label>{title}{plural}</Label>
                        <Textarea value={textarea} onChange={(e)=> setTextarea(e.target.value)} className={'multi-add-modal-text-area'}/>
                        <p><i><b>Sigue este formato:</b><br/>{title} A<br/>{title} B<br/>etc</i></p>
                    </FormField>
                )
            default: return null
        }
    }

    return (
        <Modal show={show} onClose={onClose} className='multi-add-modal'>
            <ModalHeader>Añadir {type}</ModalHeader>
            <TabNavigator defaultActiveKey={tabIndex} className='multi-add-modal-tabs'>
                <TabControl onClick={() => setTabIndex(0)}>Por Defecto</TabControl>
                <TabControl onClick={() => setTabIndex(1)}>Vía Texto</TabControl>
            </TabNavigator>
            <ModalBody>
                {renderTab()}
            </ModalBody>
            <ModalFooter className='multi-add-modal-footer'>
                <button type='button' className='btn btn-secondary' onClick={() => onClose()}>
                    Cancelar
                </button>
                <button type='button' className='btn btn-secondary' onClick={handleSubmit}>
                    Confirmar
                </button>
            </ModalFooter>
        </Modal>
    )
}

export default MultiAddModal;