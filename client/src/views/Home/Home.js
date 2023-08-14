import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Pages
import Players from '../Players';
import Teams from '../Teams';
import Tournaments from '../Tournaments';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import FormField from '../../commonComponents/FormField';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Middleware
import { navbarBack } from '../../middleware/actions/navbarActions';
// Styling
import './Home.scss';

const Home = () => {
    const [textFilter, setTextFilter] = useState('');
    const display = useSelector((state) => state.navbar.display);
    const { loading: tourneyLoading } = useSelector((state) => state.tourney.tourneyList);
    const { loading: teamLoading } = useSelector((state) => state.team.teamList);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(navbarBack(true));
        };
    }, []);

    const setPage = () => {
        switch (display) {
            case 'torneos':
                return <Tournaments applyFilter={applyFilter} />;
            case 'equipos':
                return <Teams applyFilter={applyFilter} />;
            case 'jugadores':
                return <Players applyFilter={applyFilter} />;
            default:
                return <ErrorMessage message={'Ups! No encontramos la página que esta buscando'} />;
        }
    };

    if (teamLoading || tourneyLoading) return <LoadingSpinner fullscreen={true} />;

    const applyFilter = (data) => {
        if (textFilter) {
            return data.filter((x) => x.name.toLowerCase().includes(textFilter.toLowerCase()));
        }
        return data;
    };

    return (
        <main className="home-container">
            <FormField className="home-container-filter">
                <Label>Nombre...</Label>
                <Input type="text" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
            </FormField>
            {setPage()}
        </main>
    );
};

export default Home;
