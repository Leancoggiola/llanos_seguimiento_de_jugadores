import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { capitalize } from 'lodash';
// Components
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../commonComponents/Modal';
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
    const { show, onClose, type, handleClose, existingElements } = props;

    const title = capitalize(type);
    const plural = type === 'equipo' ? 's' : 'es';
    const [total, setTotal] = useState('1');
    const [prefijo, setPrefijo] = useState();
    const [textarea, setTextarea] = useState();
    const [tabIndex, setTabIndex] = useState(0);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        let newList = [];
        try {
            if (tabIndex === 0) {
                const pref = (prefijo ? pref : title).toLowerCase();
                const offset = Math.max(
                    ...existingElements
                        .map((x) => (x?.name ? x.name.toLowerCase() : x.toLowerCase()))
                        .filter((x) => x.includes(pref))
                        .map((x) => Number(x.replace(pref, '')))
                );

                newList = Array.from({ length: total }, (_, i) => {
                    const value = `${pref} ${offset + i + 1}`;
                    if (type === 'equipo') return value;
                    else return { name: value, dni: null, age: null };
                });
            } else {
                newList = textarea
                    .split('\n')
                    .filter((x) => x)
                    .map((x) => x.toLowerCase().trim());
                if (type === 'jugador') {
                    const regex = /^(?<name>\D{0,35})-\s*(?<dni>\d{7,8})\s*-\s*(?<age>\d{1,2})$/;
                    let groups = newList.map((x) => x.match(regex)?.groups);
                    newList = groups.map((x) => {
                        if (!x?.name || !x?.dni || !x?.age)
                            throw new Error('Hay campos incorrectos');
                        else return { name: x.name.trim(), dni: x.dni.trim(), age: x.age.trim() };
                    });
                }
            }
            if (validate(newList)) {
                handleClose(newList);
                setPrefijo('');
                setTextarea('');
                setTotal('1');
                onClose();
            } else {
                throw new Error(
                    `Uno o más ${type}${plural} ya existen con esta información: ${
                        type === 'equipo' ? 'Nombre' : 'DNI'
                    } repetido`
                );
            }
        } catch (e) {
            dispatch(
                updateToastData({
                    show: true,
                    variant: 'error',
                    message: e.message,
                    closeBtn: false,
                })
            );
        }
    };

    const validate = (newList) => {
        if (type === 'equipo') {
            return !newList.some((x) => existingElements.map((x) => x.name).includes(x));
        } else {
            return tabIndex === 0
                ? !newList.some((x) => existingElements.map((x) => x.name).includes(x.name))
                : !newList.some((x) => {
                      return existingElements.map((x) => x.dni).includes(x.dni);
                  });
        }
    };

    const renderTab = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <form noValidate>
                        <FormField>
                            <Label>
                                Total de {type}
                                {plural}
                            </Label>
                            <Input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                min="1"
                                max="50"
                            />
                        </FormField>
                        <FormField>
                            <Label>Prefijo</Label>
                            <Input
                                type="text"
                                value={prefijo}
                                onChange={(e) => setPrefijo(e.target.value)}
                                maxLength="10"
                                placeholder={title}
                            />
                        </FormField>
                        <p>
                            <i>
                                <b>Por ejemplo: </b>
                                {prefijo ? prefijo : title} 1, {prefijo ? prefijo : title} 2
                            </i>
                        </p>
                    </form>
                );
            case 1:
                return (
                    <FormField>
                        <Label>
                            {title}
                            {plural}
                        </Label>
                        <Textarea
                            value={textarea}
                            onChange={(e) => setTextarea(e.target.value)}
                            className={'multi-add-modal-text-area'}
                        />
                        <p>
                            <i>
                                <b>Sigue este formato:</b>
                                <br />
                                {type === 'equipo' ? (
                                    <>
                                        River
                                        <br />
                                        Boca
                                        <br />
                                        etc
                                    </>
                                ) : (
                                    <>
                                        Facu - 12345678 - 18
                                        <br />
                                        Martin - 87654321 - 20
                                        <br />
                                        etc
                                    </>
                                )}
                            </i>
                        </p>
                    </FormField>
                );
            default:
                return null;
        }
    };

    return (
        <Modal show={show} onClose={onClose} className="multi-add-modal">
            <ModalHeader>Añadir {type}</ModalHeader>
            <TabNavigator defaultActiveKey={tabIndex} className="multi-add-modal-tabs">
                <TabControl onClick={() => setTabIndex(0)}>Por Defecto</TabControl>
                <TabControl onClick={() => setTabIndex(1)}>Vía Texto</TabControl>
            </TabNavigator>
            <ModalBody>{renderTab()}</ModalBody>
            <ModalFooter className="multi-add-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => onClose()}>
                    Cancelar
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleSubmit}>
                    Confirmar
                </button>
            </ModalFooter>
        </Modal>
    );
};

export default MultiAddModal;
