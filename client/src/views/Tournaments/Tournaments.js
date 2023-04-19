import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import TourneyCard from '../../components/TourneyCard';
import TourneyForm from '../../components/TourneyForm';
// Middleware
import {
    navbarBack,
    navbarNewEntry,
} from '../../middleware/actions/navbarActions';
// Styling
import { contentIcAddCircle } from '../../assets/icons';
import './Tournaments.scss';

const Tournaments = () => {
    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const [tourneyForm, setTourneyForm] = useState(false);

    const dispatch = useDispatch();

    const handleNewTourney = () => {
        setTourneyForm(true);
        dispatch(navbarNewEntry({ action: setTourneyForm, param: false }));
    };

    if (tourneyList.error)
        return <ErrorMessage message={tourneyList.error.message} />;

    return (
        <section className="tournament-page-container">
            {tourneyForm && (
                <TourneyForm onClose={() => dispatch(navbarBack())} />
            )}
            {!tourneyForm && (
                <>
                    {!isEmpty(tourneyList.data) &&
                        tourneyList.data.map((tourney, index) => (
                            <TourneyCard
                                key={tourney.name + index}
                                tourney={tourney}
                            />
                        ))}
                    <IconButton className="add-new" onClick={handleNewTourney}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Tournaments;
