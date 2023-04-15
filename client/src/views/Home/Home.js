
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircleOutline } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import TourneyCard from '../../components/TourneyCard';
import TourneyForm from '../../components/TourneyForm';
// Middleware
import { navbarNewEntry, navbarBack } from '../../middleware/actions/navbarActions';
// Styling

import './Home.scss';

const Home = () => {
    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const [ tourneyForm, setTourneyForm ] = useState(false)

    const dispatch = useDispatch();

    const handleNewTourney = () => {
        setTourneyForm(true)
        dispatch(navbarNewEntry({action: setTourneyForm, param: false}))
    }

    if(tourneyList.loading) return <LoadingSpinner showPosRelative={true} fullscreen={true}/>
    if(tourneyList.error) return <ErrorMessage message={tourneyList.error.message} />

    return (
        <main className='home-container page'>
            {!tourneyForm ?
            <>
                {!isEmpty(tourneyList.data) && tourneyList.data.map((tourney, index) => (
                    <TourneyCard key={tourney.name+index} tourney={tourney}/>
                ))}
                <IconButton className='add-new-tourney' onClick={handleNewTourney}>
                    <Icon src={contentIcAddCircleOutline}/>
                </IconButton>
            </>
            :
            <TourneyForm onClose={() => dispatch(navbarBack())} />
            }
        </main>
    )
}

export default Home;