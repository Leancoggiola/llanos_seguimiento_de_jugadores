import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcRemove } from '../../assets/icons';
import Button from '../../commonComponents/Button';
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
import teamIcon from '../../assets/team-icon.webp';
// Middleware
import { postTeamRequest, putTeamRequest } from '../../middleware/actions/teamActions';
// Styling
import './TeamForm.scss';

const TeamForm = (props) => {
    const { team, onClose } = props;

    const [nombre, setNombre] = useState(team?._id ? team.name : '');
    const [jugadores, setJugadores] = useState([]);
    const [jugadoresDropdown, setJugadoresDropdown] = useState(team?.players ? team.players.map((x) => x._id) : []);
    const [jugadoresList, setList] = useState([]);
    const [showMultiAdd, setMultiAdd] = useState(false);

    const playerList = useSelector((state) => state.player.playerList);
    const teamCrud = useSelector((state) => state.team.crud);

    const dispatch = useDispatch();

    useEffect(() => {
        const playerData = playerList.data.filter((x) => jugadoresDropdown.includes(x._id));
        setList([...new Set([...jugadores, ...playerData])]);
    }, [jugadores, jugadoresDropdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: nombre,
            players: jugadoresList,
        };
        if (team?._id) {
            dispatch(putTeamRequest({ body, resolve: onClose, id: team._id }));
        } else {
            dispatch(postTeamRequest({ body, resolve: onClose }));
        }
    };

    const handleNewPlayers = (data) => {
        setJugadores([...new Set([...jugadores, ...data])]);
    };

    const handleRemove = (item) => {
        const newPlayers = jugadores.filter((x) => x.name !== item.name);
        setJugadores([...newPlayers]);
    };

    const isRemovable = (item) => {
        return !playerList.data.some((x) => item.dni !== null && x.dni === item.dni);
    };

    if (teamCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="team-form">
            <div className="team-form-img-container">
                <img src={teamIcon} alt={'team-icon'} />
            </div>
            <div className="team-form-container">
                <h1>{team?.name ? 'Editar' : 'Nuevo'} Equipo</h1>
                <form noValidate>
                    <FormField>
                        <Label>Nombre</Label>
                        <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required={true}></Input>
                    </FormField>
                    <h1>Jugadores</h1>
                    <FormField>
                        <Label>Jugador</Label>
                        <Select value={jugadoresDropdown} onChange={(e) => setJugadoresDropdown(e)} filter={true} multiple={true}>
                            {playerList.data
                                .filter((x) => x.team_id === team?._id || !x.team_id)
                                .map((option, index) => (
                                    <Option value={option._id} key={option._id + index}>
                                        {capitalize(option.name)}
                                    </Option>
                                ))}
                        </Select>
                    </FormField>
                    <div className="team-form-new-player">
                        <Button type="button" variant="text-alt" onClick={() => setMultiAdd(true)}>
                            Nuevo jugador
                        </Button>
                    </div>
                    {jugadoresList.length > 0 && (
                        <List>
                            {jugadoresList.map((player, index) => (
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
                </form>
            </div>
            <div className="team-form-action-buttons">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" onClick={(e) => handleSubmit(e)}>
                    {team?.name ? 'Editar' : 'Crear'}
                </Button>
            </div>
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
