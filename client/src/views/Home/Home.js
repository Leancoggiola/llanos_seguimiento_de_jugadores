import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Pages
import Players from '../Players';
import Teams from '../Teams';
import Tournaments from '../Tournaments';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
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
                return <Tournaments />;
            case 'equipos':
                return <Teams />;
            case 'jugadores':
                return <Players />;
            default:
                return <ErrorMessage message={'Ups! No encontramos la página que esta buscando'} />;
        }
    };

    if (teamLoading || tourneyLoading) return <LoadingSpinner fullscreen={true} />;

    return <main className="home-container"> {setPage()}</main>;
};

export default Home;
