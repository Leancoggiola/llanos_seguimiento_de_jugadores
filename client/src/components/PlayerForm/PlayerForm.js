import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcRemove } from '../../assets/icons';
import Button from '../../commonComponents/Button';
import DatePicker from '../../commonComponents/DatePicker';
import FormField from '../../commonComponents/FormField';
import FormFieldError from '../../commonComponents/FormFieldError';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import List from '../../commonComponents/List';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Assets
import playerIcon from '../../assets/shirt-icon.webp';
// Middleware
import { postPlayerRequest, putPlayerRequest } from '../../middleware/actions/playerActions';
// Styling
import './PlayerForm.scss';

const PlayerForm = (props) => {
    const { player, onClose } = props;

    const [nombre, setNombre] = useState(player?.name ? player.name : '');
    const [dni, setDNI] = useState(player?.dni ? player.dni : '');
    const [age, setAge] = useState(player?.age ? player.age : '');
    const [sancion, setSancion] = useState(player?.sanction ? player.sanction : 0);
    const [date, setDate] = useState(player?.sanction_date ? new Date(player.sanction_date) : new Date());
    const [history, setHistory] = useState(player.sanction_history);

    const dispatch = useDispatch();

    const playerCrud = useSelector((state) => state.player.crud);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: nombre,
            dni: dni,
            age: age,
            sanction: Number(sancion),
            sanction_date: date,
            update_date: Number(sancion) > 0 && sancion !== player?.sanction && new Date(player?.sanction_date) !== date,
            sanction_history: history,
        };
        if (player?._id) {
            dispatch(putPlayerRequest({ body, resolve: onClose, id: player._id }));
        } else {
            dispatch(postPlayerRequest({ body, resolve: onClose }));
        }
    };

    const handleRemoveSanction = (index) => {
        setHistory([...player.sanction_history.filter((_, i) => i !== index)]);
    };

    const formatDate = (dateToFormat) => {
        const newD = new Date(dateToFormat);
        return `${newD.getDate()}-${newD.getMonth()}-${newD.getFullYear()}`;
    };

    console.log(player);
    if (playerCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="player-form">
            <div className="player-form-img-container">
                <img src={playerIcon} alt={'player-icon'} />
            </div>
            <div className="player-form-container">
                <h1>{player?.name ? 'Editar' : 'Nuevo'} Jugador</h1>
                <form noValidate>
                    <FormField>
                        <Label>Nombre</Label>
                        <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required={true} />
                        {player?.name && nombre === '' && <FormFieldError>Este campo es requerido</FormFieldError>}
                    </FormField>
                    <FormField>
                        <Label>DNI</Label>
                        <Input type="text" value={dni} onChange={(e) => setDNI(e.target.value)} maxLength="8" />
                    </FormField>
                    <div className="player-form-numbers">
                        <FormField>
                            <Label>Edad</Label>
                            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={1} max={99} />
                        </FormField>
                    </div>
                    {player?._id && (
                        <div className="player-form-numbers">
                            <FormField>
                                <Label>Sanción</Label>
                                <Input type="number" value={sancion} onChange={(e) => setSancion(e.target.value)} min={0} max={99} disabled={player?.sanction > 0} />
                            </FormField>
                            <FormField>
                                <Label>Fecha sanción</Label>
                                <DatePicker
                                    disabled={Number(sancion) === 0 || player?.sanction_date}
                                    value={date}
                                    onChange={(e) => setDate(e)}
                                    showLeadingZeros={false}
                                    format="dd-MM-yyyy"
                                    onlyIcon={false}
                                />
                            </FormField>
                        </div>
                    )}
                    {history.length > 0 && (
                        <>
                            <h4>Historial de Sanciones</h4>
                            <div className="player-form-list">
                                <List>
                                    {history.map((sanction, index) => (
                                        <div className="player-form-list-sanction" key={'sanction-' + index}>
                                            <p>Sanciones: {sanction.initial_sanction}</p>
                                            <p>Fecha: {formatDate(sanction.sanction_date)}</p>
                                            <IconButton onClick={() => handleRemoveSanction(index)}>
                                                <Icon src={contentIcRemove} />
                                            </IconButton>
                                        </div>
                                    ))}
                                </List>
                            </div>
                        </>
                    )}
                </form>
            </div>
            <div className="player-form-action-buttons">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" onClick={(e) => handleSubmit(e)} disabled={player?.name && nombre === ''}>
                    {player?.name ? 'Editar' : 'Crear'}
                </Button>
            </div>
        </section>
    );
};

export default PlayerForm;
