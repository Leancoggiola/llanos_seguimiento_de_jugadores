import { capitalize } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcRemove } from '../../assets/icons';
import FormField from '../../commonComponents/FormField';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import List from '../../commonComponents/List';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import { Option, Select } from '../../commonComponents/Select';
import MultiAddModal from '../MultiAddModal';
// Assets
import teamIcon from '../../assets/team-icon.png';
// Middleware
import { postTeamRequest } from '../../middleware/actions/teamActions';
// Styling
import './TeamForm.scss';

const TeamForm = (props) => {
    const { team, onClose } = props;

    const [nombre, setNombre] = useState('');
    const [jugadores, setJugadores] = useState([]);
    const [showMultiAdd, setMultiAdd] = useState(false);

    const playerList = useSelector((state) => state.player.playerList);
    const teamCrud = useSelector((state) => state.team.crud);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const postBody = {
            name: nombre,
            players: jugadores,
        };
        dispatch(postTeamRequest({ postBody, resolve: onClose }));
    };

    const handlePlayerChange = (e) => {
        const player = playerList.data.filter((x) => e.includes(x._id));
        const newPlayer = jugadores.filter(
            (x) => !playerList.data.map((player) => player.dni).includes(x.dni)
        );
        setJugadores([...new Set([...player, ...newPlayer])]);
    };

    const handleNewPlayers = (data) => {
        setJugadores([...new Set([...jugadores, ...data])]);
    };

    const handleRemove = (item) => {
        const newPlayers = jugadores.filter((x) => x.name !== item.name);
        setJugadores([...newPlayers]);
    };

    const isRemovable = (item) => {
        return !playerList.data.some((x) => x.dni === item.dni);
    };

    if (teamCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="team-form">
            <div className="img-container">
                <img src={teamIcon} alt={'team-icon'} />
            </div>
            <h1>Nuevo Equipo</h1>
            <form noValidate>
                <FormField>
                    <Label>Nombre</Label>
                    <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required={true}
                    ></Input>
                </FormField>
                <h1>Jugadores</h1>
                <FormField>
                    <Label>Jugador</Label>
                    <Select
                        value={jugadores}
                        onChange={(e) => handlePlayerChange(e)}
                        filter={true}
                        multiple={true}
                    >
                        {playerList.data.map((option, index) => (
                            <Option value={option._id} key={option._id + index}>
                                {capitalize(option.name)}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <div className="team-form-new-player">
                    <span onClick={() => setMultiAdd(true)}>Nuevo jugador</span>
                </div>
                {jugadores.length > 0 && (
                    <List>
                        {jugadores.map((player, index) => (
                            <div className="team-form-player-list" key={player.dni + index}>
                                <p>{capitalize(player.name)}</p>
                                <p>{player.dni}</p>
                                {isRemovable(player) && (
                                    <IconButton onClick={() => handleRemove(player)}>
                                        <Icon src={contentIcRemove} />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </List>
                )}
                <div className="team-form-action-buttons">
                    <button type="submit" onClick={onClose} className="btn btn-secondary">
                        <strong>Cancelar</strong>
                    </button>
                    <button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        className="btn btn-secondary"
                    >
                        <strong>Crear</strong>
                    </button>
                </div>
            </form>
            <MultiAddModal
                show={showMultiAdd}
                onClose={() => setMultiAdd(false)}
                type={'jugador'}
                handleClose={handleNewPlayers}
                existingElements={[...playerList.data, ...jugadores]}
            />
        </section>
    );
};

export default TeamForm;
