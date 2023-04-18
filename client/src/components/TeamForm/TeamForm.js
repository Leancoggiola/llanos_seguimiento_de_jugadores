import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import FormField from '../../commonComponents/FormField';
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

    const [ nombre, setNombre ] = useState('');
    const [ jugadores, setJugadores ] = useState([]) 
    const [ showMultiAdd , setMultiAdd ] = useState(false)

    const playerList = useSelector((state) => state.player.playerList)
    const teamCrud = useSelector((state) => state.team.crud)

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault()
        const postBody = {
            name: nombre,
            players: jugadores
        }
        dispatch(postTeamRequest({postBody, resolve: onClose}))
    }

    const handlePlayerChange = (e) => {
        const player = playerList.data.filter(x => e.includes(x._id)).map(x => x.name);
        const newPlayer = jugadores.filter(x => !playerList.data.map(player => player.name).includes(x))
        setJugadores([...new Set([...newPlayer, ...player])])
    }

    const handleNewPlayers = (data) => {
        setJugadores([...new Set([...jugadores, ...data])])
    }

    const handleRemove = (item) => {
        const newPlayers = jugadores.filter(x => x !== item)
        setJugadores([...newPlayers])
    }

    const isRemovable = (item) => {
        return !playerList.data.some(x => x.name === item)
    }

    if (teamCrud.loading) {
        return <LoadingSpinner fullscreen={true}/>
    }

    return (
        <section className='team-form'>
            <div className='img-container'>
                <img src={teamIcon} alt={'team-icon'}/>  
            </div>   
            <h1>Nuevo Equipo</h1>
            <form noValidate>
                <FormField>
                    <Label>Nombre</Label>
                    <Input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} required={true}></Input>
                </FormField>
                <h1>Jugadores</h1>
                <FormField>
                    <Label>Jugador</Label>
                    <Select value={jugadores} onChange={(e) => handlePlayerChange(e)} filter={true} multiple={true}>
                        {playerList.data.map((option, index) => (
                            <Option value={option._id} key={option._id+index} >
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <div className='team-form-new-player'>
                    <span onClick={() => setMultiAdd(true)}>Nuevo jugador</span>
                </div>
                {jugadores.length > 0 && <List items={jugadores} removeBtn={isRemovable} onRemove={handleRemove} />}
                <div className='team-form-action-buttons'>
                    <button type='submit' onClick={onClose} className='btn btn-secondary'>
                        <strong>Cancelar</strong>
                    </button>
                    <button type='submit' onClick={(e) => handleSubmit(e)} className='btn btn-secondary'>
                        <strong>Crear</strong>
                    </button>
                </div>
            </form>
            <MultiAddModal show={showMultiAdd} onClose={()=> setMultiAdd(false)} type={'jugador'} handleClose={handleNewPlayers} names={playerList.data.map(x => x.name)}/>
        </section>
    )
}

export default TeamForm;