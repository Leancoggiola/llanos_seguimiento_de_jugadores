import { useSelector } from 'react-redux';
// Pages
import Tournaments from '../Tournaments';
import Teams from '../Teams';
import Players from '../Players';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Styling
import './Home.scss';

const Home = () => {
    const display = useSelector((state) => state.navbar.display);
    const { loading: tourneyLoading } = useSelector((state) => state.tourney.tourneyList);
    const { loading: teamLoading } = useSelector((state) => state.team.teamList);

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

    if (teamLoading || tourneyLoading)
        return <LoadingSpinner showPosRelative={true} fullscreen={true} />;

    return <main className="home-container">{setPage()}</main>;
};

export default Home;
