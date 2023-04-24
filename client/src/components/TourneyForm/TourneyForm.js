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
import trophyIcon from '../../assets/trophy-icon.png';
// Middleware
import { postTourneyRequest, putTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyForm.scss';

const MODALIDADES = ['Grupos+Eliminatoria'];

const TourneyForm = (props) => {
    const { tourney, onClose } = props;

    const [nombre, setNombre] = useState(tourney?.name ? tourney.name : '');
    const [modalidad, setModalidad] = useState(tourney?.name ? tourney.type : '');
    const [equipos, setEquipos] = useState([]);
    const [equiposDropdown, setEquiposDropdown] = useState(
        tourney?.teams ? tourney.teams.map((x) => x._id) : []
    );
    const [equiposList, setList] = useState([]);
    const [showMultiAdd, setMultiAdd] = useState(false);

    const teamList = useSelector((state) => state.team.teamList);
    const tourneyCrud = useSelector((state) => state.tourney.crud);

    const dispatch = useDispatch();

    useEffect(() => {
        const teamData = teamList.data.filter((x) => equiposDropdown.includes(x._id));
        setList([...new Set([...equipos, ...teamData])]);
    }, [equipos, equiposDropdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            name: nombre,
            status: 'Nuevo',
            type: modalidad,
            teams: equipos,
        };
        if (tourney?.name) {
            dispatch(putTourneyRequest({ body, resolve: onClose }));
        } else {
            dispatch(postTourneyRequest({ body, resolve: onClose }));
        }
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

    if (tourneyCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <article className="tourney-form">
            <div className="img-container">
                <img src={trophyIcon} alt={'trophy-icon'} />
            </div>
            <h1>{tourney?.name ? 'Editar' : 'Nuevo'} Torneo</h1>
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
                <FormField>
                    <Label>Modalidad</Label>
                    <Select value={modalidad} onChange={(e) => setModalidad(e)} required={true}>
                        {MODALIDADES.map((option) => (
                            <Option value={option} key={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <h1>Equipos</h1>
                <FormField>
                    <Label>Equipos</Label>
                    <Select
                        value={equiposDropdown}
                        onChange={(e) => setEquiposDropdown(e)}
                        filter={true}
                        multiple={true}
                    >
                        {teamList.data.map((option, index) => (
                            <Option value={option._id} key={option._id + index}>
                                {capitalize(option.name)}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <div className="tourney-form-new-team">
                    <Button type="button" variant="text-alt" onClick={() => setMultiAdd(true)}>
                        Nuevo equipo
                    </Button>
                    <span></span>
                </div>
                {equiposList.length > 0 && (
                    <List>
                        {equiposList.map((equipo, index) => (
                            <div className="team-form-equipo-list" key={equipo._id + index}>
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
                    <Button type="submit" variant="primary" onClick={(e) => handleSubmit(e)}>
                        {tourney?.name ? 'Editar' : 'Crear'}
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
        </article>
    );
};

export default TourneyForm;
