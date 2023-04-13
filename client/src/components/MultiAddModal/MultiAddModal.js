import { useState } from 'react';
// Components
import {Modal, ModalHeader, ModalBody, ModalFooter} from '../../commonComponents/Modal';
import { TabControl, TabNavigator } from '../../commonComponents/TabNavigator';
import FormField from '../../commonComponents/FormField';
import Label from '../../commonComponents/Label';
import Input from '../../commonComponents/Input';
import Textarea from '../../commonComponents/Textarea';
// Styling
import './MultiAddModal.scss';

const MultiAddModal = (props) => {
    const { show, onClose, type, handleClose } = props;

    const [ total, setTotal ] = useState('1');
    const [ prefijo, setPrefijo ] = useState();
    const [ textarea, setTextarea ] = useState();
    const [ tabIndex, setTabIndex ] = useState(0)

    const handleSubmit = (e) => {
        e.preventDefault()
        let equipos = []
        if(tabIndex === 0) {
            equipos = Array.from({length: total}, (_, i) => `${prefijo ? prefijo : 'Equipo'} ${i+1}`);
        } else {
            equipos = textarea.split('\n').filter(x => x)
        }
        handleClose(equipos)
        onClose()
    }

    const renderTab = () => {
        switch(tabIndex) {
            case(0):
                return (
                    <form noValidate>
                        <FormField>
                            <Label>Total de equipos</Label>
                            <Input type='number' value={total} onChange={(e)=> setTotal(e.target.value)} min='1' max='50'/>
                        </FormField>
                        <FormField>
                            <Label>Prefijo</Label>
                            <Input type='text' value={prefijo} onChange={(e)=> setPrefijo(e.target.value)} maxLength='10' placeholder={'Equipo'}/>
                        </FormField>
                        <p><i><b>Por ejemplo: </b>{prefijo ? prefijo : 'Equipo'} 1, {prefijo ? prefijo : 'Equipo'} 2</i></p>
                    </form>
                )
            case(1):
                return (
                    <FormField>
                        <Label>Equipos</Label>
                        <Textarea value={textarea} onChange={(e)=> setTextarea(e.target.value)} className={'multi-add-modal-text-area'}/>
                        <p><i><b>Sigue este formato:</b><br/>Equipo A<br/>Equipo B<br/>etc</i></p>
                    </FormField>
                )
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