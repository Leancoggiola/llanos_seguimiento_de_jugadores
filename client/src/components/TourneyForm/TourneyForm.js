import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Components
import FormField from '../../commonComponents/FormField';
import Label from '../../commonComponents/Label';
import Input from '../../commonComponents/Input';
import { Option, Select } from '../../commonComponents/Select';
import MultiAddModal from '../MultiAddModal';
// Assets
import trophyIcon from '../../assets/trophy-icon.png';
// Middleware
import { postTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyForm.scss';
import List from '../../commonComponents/List';

const MODALIDADES = ["Grupos+Eliminatoria"];

const TourneyForm = (props) => {
    const { tourney, setTourneyForm } = props;

    const [ nombre, setNombre ] = useState('');
    const [ modalidad, setModalidad] = useState();
    const [ equipos, setEquipos ] = useState([]) 
    const [ showMultiAdd , setMultiAdd ] = useState(true)

    const teamList = useSelector((state) => state.team.teamList)

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault()
        const postBody = {
            name: nombre,
            status: 'Iniciado',
            type: modalidad,
            teams: equipos
        }
        dispatch(postTourneyRequest(postBody))
    }

    const handleNewEquipos = (data) => {
        setEquipos(data)
    }

    return (
        <section className='tourney-form'>
            <div className='img-container'>
                <img src={trophyIcon} alt={'trophy'}/>  
            </div>   
            <h1>Nuevo Torneo</h1>
            <form noValidate>
                <FormField>
                    <Label>Nombre</Label>
                    <Input type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} required={true}></Input>
                </FormField>
                <FormField>
                    <Label>Modalidad</Label>
                    <Select value={modalidad} onChange={(e) => setModalidad(e)} required={true} >
                        {MODALIDADES.map(option => (
                            <Option value={option} key={option} >
                                {option}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <h2>Equipos</h2>
                <FormField>
                    <Label>Equipos</Label>
                    <Select value={modalidad} onChange={(e) => setModalidad(e)} >
                        {teamList.data.map((option, index) => (
                            <Option value={option} key={option.name+index} >
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <button type='button' className='tourney-form-new-team' onClick={() => setMultiAdd(true)}>Nuevo equipo</button>
                {equipos.length > 0 && <List items={equipos}/>}
                <div className='tourney-form-action-buttons'>
                    <button type='submit' onClick={() => setTourneyForm(false)} className='btn btn-secondary'>
                        <strong>Cancelar</strong>
                    </button>
                    <button type='submit' onClick={(e) => handleSubmit(e)} className='btn btn-secondary'>
                        <strong>Crear</strong>
                    </button>
                </div>
            </form>
            <MultiAddModal show={showMultiAdd} onClose={()=> setMultiAdd(false)} type={'equipo'} handleClose={handleNewEquipos}/>
        </section>
    )
}

export default TourneyForm;