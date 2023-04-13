import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { Card, CardBody } from '../../commonComponents/Card';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Middleware
import { navbarNewEntry } from '../../middleware/actions/navbarActions'
// Styling
import { contentIcAddCircleOutline } from '../../assets/icons';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import './Home.scss';
import { useState } from 'react';
import TourneyCard from '../../components/TourneyForm';
import TourneyForm from '../../components/TourneyForm';

const Home = () => {
    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const [ tourneyForm, setTourneyForm ] = useState(true)

    const dispatch = useDispatch();

    const handleNewTourney = () => {
        setTourneyForm(true)
        dispatch(navbarNewEntry({action: setTourneyForm, param: false}))
    }

    if(tourneyList.loading) return <LoadingSpinner showPosRelative={true} fullscreen={true}/>
    if(tourneyList.error) return <ErrorMessage message={tourneyList.error.message} />

    return (
        <main className='home-container page'>
            { !tourneyForm ?
            <>
                {!isEmpty(tourneyList.data) && tourneyList.data.map((tourney, index) => (
                    <TourneyCard key={tourney.name+index} tourney={tourney}/>
                ))}
                <IconButton className='add-new-tourney' onClick={handleNewTourney}>
                    <Icon src={contentIcAddCircleOutline}/>
                </IconButton>
            </>
            :
            <TourneyForm setTourneyForm={setTourneyForm} />
            }
        </main>
    )
}

export default Home;