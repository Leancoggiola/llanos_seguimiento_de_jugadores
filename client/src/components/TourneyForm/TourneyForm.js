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
import trophyIcon from '../../assets/trophy-icon.png';
// Middleware
import { postTourneyRequest } from '../../middleware/actions/tourneyActions';
// Styling
import './TourneyForm.scss';

const MODALIDADES = ['Grupos+Eliminatoria'];

const TourneyForm = (props) => {
    const { tourney, onClose } = props;

    const [nombre, setNombre] = useState('');
    const [modalidad, setModalidad] = useState();
    const [equipos, setEquipos] = useState([]);
    const [showMultiAdd, setMultiAdd] = useState(false);

    const teamList = useSelector((state) => state.team.teamList);
    const tourneyCrud = useSelector((state) => state.tourney.crud);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const postBody = {
            name: nombre,
            status: 'Nuevo',
            type: modalidad,
            teams: equipos,
        };
        dispatch(postTourneyRequest({ postBody, resolve: onClose }));
    };

    const handleEquipoChange = (e) => {
        const team = teamList.data
            .filter((x) => e.includes(x._id))
            .map((x) => x.name);
        const newEquipo = equipos.filter(
            (x) => !teamList.data.map((team) => team.name).includes(x)
        );
        setEquipos([...new Set([...newEquipo, ...team])]);
    };

    const handleNewEquipos = (data) => {
        setEquipos([...new Set([...equipos, ...data])]);
    };

    const handleRemove = (item) => {
        const newEquipos = equipos.filter((x) => x !== item);
        setEquipos([...newEquipos]);
    };

    const isRemovable = (item) => {
        return !teamList.data.some((x) => x.name === item);
    };

    if (tourneyCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="tourney-form">
            <div className="img-container">
                <img src={trophyIcon} alt={'trophy-icon'} />
            </div>
            <h1>Nuevo Torneo</h1>
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
                    <Select
                        value={modalidad}
                        onChange={(e) => setModalidad(e)}
                        required={true}
                    >
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
                        value={equipos}
                        onChange={(e) => handleEquipoChange(e)}
                        filter={true}
                        multiple={true}
                    >
                        {teamList.data.map((option, index) => (
                            <Option value={option._id} key={option._id + index}>
                                {option.name}
                            </Option>
                        ))}
                    </Select>
                </FormField>
                <div className="tourney-form-new-team">
                    <span onClick={() => setMultiAdd(true)}>Nuevo equipo</span>
                </div>
                {equipos.length > 0 && (
                    <List
                        items={equipos}
                        removeBtn={isRemovable}
                        onRemove={handleRemove}
                    />
                )}
                <div className="tourney-form-action-buttons">
                    <button
                        type="submit"
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
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
                type={'equipo'}
                handleClose={handleNewEquipos}
                names={teamList.data.map((x) => x.name)}
            />
        </section>
    );
};

export default TourneyForm;
