import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { actionIcDelete, contentIcRemove } from '../../assets/icons';
import Button from '../../commonComponents/Button';
import FormField from '../../commonComponents/FormField';
import FormFieldError from '../../commonComponents/FormFieldError';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import List from '../../commonComponents/List';
import { Option, Select } from '../../commonComponents/Select';
import DeleteConfirmation from '../DeleteConfirmation';
import MultiAddModal from '../MultiAddModal';
// Assets
import trophyIcon from '../../assets/trophy-icon.png';
// Middleware
import { deleteTourneyRequest, postTourneyRequest, putTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyForm.scss';

const MODALIDADES = ['Grupos+Eliminatoria'];
const CATEGORIAS = ['Veterano', 'Libre'];

const TourneyForm = (props) => {
    const { tourney, onClose } = props;

    const [nombre, setNombre] = useState(tourney?._id ? tourney.name : '');
    const [modalidad, setModalidad] = useState(tourney?._id ? tourney.type : '');
    const [categoria, setCategoria] = useState(tourney?._id ? tourney.category : '');
    const [equipos, setEquipos] = useState([]);
    const [equiposDropdown, setEquiposDropdown] = useState(tourney?.teams ? tourney.teams.map((x) => x._id) : []);
    const [equiposList, setList] = useState([]);
    const [showMultiAdd, setMultiAdd] = useState(false);
    const [showDelete, setDelete] = useState(false);
    const [error, setError] = useState(false);

    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const teamList = useSelector((state) => state.team.teamList);

    const dispatch = useDispatch();

    useEffect(() => {
        const teamData = teamList.data.filter((x) => equiposDropdown.includes(x._id));
        setList([...new Set([...equipos, ...teamData])]);
    }, [equipos, equiposDropdown]);

    useEffect(() => {
        if (nombre === '' || modalidad === '' || categoria === '') {
            setError(true);
        } else setError(false);
    }, [nombre, modalidad, categoria]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: nombre,
            status: 'Nuevo',
            type: modalidad,
            category: categoria,
            teams: equiposList,
        };
        if (tourney?._id) {
            dispatch(putTourneyRequest({ body, resolve: onClose, id: tourney._id }));
        } else {
            dispatch(postTourneyRequest({ body, resolve: onClose }));
        }
    };

    const handleDelete = () => {
        dispatch(deleteTourneyRequest({ id: tourney._id, resolve: onClose }));
    };

    const handleNewEquipos = (data) => {
        setEquipos([...new Set([...equipos, ...data])]);
    };

    const handleRemove = (item) => {
        const newEquipos = equipos.filter((x) => x.name !== item.name);
        setEquipos([...newEquipos]);
    };

    const isRemovable = (item) => {
        return !teamList.data.some((x) => x.name === item.name);
    };

    const isEnableSubmit = () => {
        return !nombre || !modalidad || !categoria || error;
    };

    return (
        <article className="tourney-form">
            <div className="img-container">
                <img src={trophyIcon} alt={'trophy-icon'} />
            </div>
            <h1>{tourney?._id ? 'Editar' : 'Nuevo'} Torneo</h1>
            <form noValidate>
                <FormField>
                    <Label>Nombre</Label>
                    <Input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required={true}></Input>
                    {error && nombre === '' && <FormFieldError>Este campo es requerido</FormFieldError>}
                </FormField>
                <FormField>
                    <Label>Modalidad</Label>
                    <Select value={modalidad} onChange={(e) => setModalidad(e)} required={true}>
                        {MODALIDADES.map((option) => (
                            <Option value={option} key={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                    {error && modalidad === '' && <FormFieldError>Este campo es requerido</FormFieldError>}
                </FormField>
                <FormField>
                    <Label>Categoría</Label>
                    <Select value={categoria} onChange={(e) => setCategoria(e)} required={true}>
                        {CATEGORIAS.map((option) => (
                            <Option value={option} key={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                    {error && categoria === '' && <FormFieldError>Este campo es requerido</FormFieldError>}
                </FormField>
                <h1>Equipos</h1>
                <FormField>
                    <Label>Equipos</Label>
                    <Select value={equiposDropdown} onChange={(e) => setEquiposDropdown(e)} filter={true} multiple={true} disabled={tourney?.groups.length > 0}>
                        {teamList.data
                            .filter(
                                (team) =>
                                    team.tourney_ids.includes(tourney?._id) || !tourneyList.data.some((x) => team.tourney_ids.includes(x._id) && tourney?.status === 'Terminado')
                            )
                            .map((option, index) => (
                                <Option value={option._id} key={option._id + index}>
                                    {capitalize(option.name)}
                                </Option>
                            ))}
                    </Select>
                </FormField>
                <div className="tourney-form-new-team">
                    <Button type="button" variant="text-alt" onClick={() => setMultiAdd(true)} disabled={tourney?.groups.length > 0}>
                        Nuevo equipo
                    </Button>
                    <span></span>
                </div>
                {equiposList.length > 0 && (
                    <List>
                        {equiposList.map((equipo, index) => (
                            <div className="tourney-form-equipo-list" key={equipo._id + index}>
                                <p>{capitalize(equipo.name)}</p>
                                {isRemovable(equipo) && (
                                    <IconButton onClick={() => handleRemove(equipo)}>
                                        <Icon src={contentIcRemove} />
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </List>
                )}
                <div className="tourney-form-action-buttons">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    {tourney?._id && (
                        <IconButton type="button" onClick={() => setDelete(true)} className="tourney-form-action-buttons-del">
                            <Icon src={actionIcDelete} />
                        </IconButton>
                    )}
                    <Button type="submit" variant="primary" onClick={(e) => handleSubmit(e)} disabled={isEnableSubmit()}>
                        {tourney?._id ? 'Editar' : 'Crear'}
                    </Button>
                </div>
            </form>
            <MultiAddModal
                show={showMultiAdd}
                onClose={() => setMultiAdd(false)}
                type={'equipo'}
                handleClose={handleNewEquipos}
                existingElements={[...teamList.data, ...equipos]}
            />
            <DeleteConfirmation show={showDelete} onClose={() => setDelete(false)} onSubmit={handleDelete} message={'¿Estas seguro de eliminar este torneo?'} />
        </article>
    );
};

export default TourneyForm;
