
import { useSelector } from 'react-redux';
// Pages
import Tournaments from '../Tournaments';
import Teams from '../Teams';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Styling
import './Home.scss';

const Home = () => {
    const display = useSelector((state) => state.navbar.display);
    const { loading: tourneyLoading } = useSelector((state) => state.tourney.tourneyList);
    const { loading: teamLoading } = useSelector((state) => state.team.teamList);
    // const display = useSelector((state) => state.navbar.display);

    const setPage = () => {
        switch(display) {
            case('tourneys'):
                return <Tournaments/>
            case('teams'):
                return <Teams/>
            default:
                return <ErrorMessage message={'Ups! No encontramos la página que esta buscando'} />
        }
    }

    if(teamLoading || tourneyLoading) return <LoadingSpinner showPosRelative={true} fullscreen={true}/>

    return (
        <main className='home-container page'>
            {setPage()}
        </main>
    )
}

export default Home;