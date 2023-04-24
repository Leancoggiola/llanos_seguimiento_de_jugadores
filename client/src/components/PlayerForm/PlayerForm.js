import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Button from '../../commonComponents/Button';
import FormField from '../../commonComponents/FormField';
import FormFieldError from '../../commonComponents/FormFieldError';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Assets
import playerIcon from '../../assets/shirt-icon.png';
// Middleware
import { postPlayerRequest, putPlayerRequest } from '../../middleware/actions/playerActions';
// Styling
import './PlayerForm.scss';

const PlayerForm = (props) => {
    const { player, onClose } = props;

    const [nombre, setNombre] = useState(player?.name ? player.name : '');
    const [dni, setDNI] = useState(player?.dni ? player.dni : '');
    const [age, setAge] = useState(player?.age ? player.age : '');

    const dispatch = useDispatch();

    const playerCrud = useSelector((state) => state.player.crud);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: nombre,
            dni: dni,
            age: age,
        };
        if (player.name) {
            dispatch(putPlayerRequest({ body, resolve: onClose }));
        } else {
            dispatch(postPlayerRequest({ body, resolve: onClose }));
        }
    };

    if (playerCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="player-form">
            <div className="img-container">
                <img src={playerIcon} alt={'player-icon'} />
            </div>
            <h1>{player?.name ? 'Editar' : 'Nuevo'} Jugador</h1>
            <form noValidate>
                <FormField>
                    <Label>Nombre</Label>
                    <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required={true}
                    />
                    {player?.name && nombre === '' && (
                        <FormFieldError>Este campo es requerido</FormFieldError>
                    )}
                </FormField>
                <FormField>
                    <Label>DNI</Label>
                    <Input
                        type="text"
                        value={dni}
                        onChange={(e) => setDNI(e.target.value)}
                        maxLength="8"
                        required={true}
                    />
                    {player?.name && dni === '' && (
                        <FormFieldError>Este campo es requerido</FormFieldError>
                    )}
                </FormField>
                <FormField>
                    <Label>Edad</Label>
                    <Input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min={1}
                        max={99}
                    />
                </FormField>
                <div className="player-form-action-buttons">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={(e) => handleSubmit(e)}
                        disabled={player?.name && (dni === '' || nombre === '')}
                    >
                        {player?.name ? 'Editar' : 'Crear'}
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default PlayerForm;
