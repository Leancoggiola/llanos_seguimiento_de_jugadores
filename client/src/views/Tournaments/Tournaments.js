import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import TourneyCard from '../../components/TourneyCard';
import TourneyForm from '../../components/TourneyForm';
import TourneyDetails from '../../components/TourneyDetails';
// Middleware
import { navbarBack, navbarNewEntry } from '../../middleware/actions/navbarActions';
// Styling
import { contentIcAddCircle } from '../../assets/icons';
import './Tournaments.scss';

const Tournaments = () => {
    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const [tourneyForm, setTourneyForm] = useState(false);
    const [tourneyDetails, setTourneyDetails] = useState(false);
    const [selectedTourney, setSelectedTourney] = useState(null);

    const dispatch = useDispatch();

    const handleABMTourney = (isEdit) => {
        setTourneyForm(true);
        dispatch(navbarNewEntry({ action: setTourneyForm, param: false }));
    };

    useEffect(() => {
        !tourneyForm && setSelectedTourney(null);
    }, [tourneyForm]);

    useEffect(() => {
        selectedTourney && handleABMTourney();
    }, [selectedTourney]);

    if (tourneyList.error) return <ErrorMessage message={tourneyList.error.message} />;

    return (
        <section className="tournament-page-container">
            {tourneyForm && (
                <TourneyForm onClose={() => dispatch(navbarBack())} tourney={selectedTourney} />
            )}
            {tourneyDetails && (
                <TourneyDetails onClose={() => dispatch(navbarBack())} tourney={selectedTourney} />
            )}
            {!tourneyForm && !tourneyDetails && (
                <article>
                    {!isEmpty(tourneyList.data) &&
                        tourneyList.data.map((tourney, index) => (
                            <TourneyCard
                                key={tourney.name + index}
                                tourney={tourney}
                                setSelectedTourney={setSelectedTourney}
                            />
                        ))}
                    <IconButton className="add-new" onClick={() => handleABMTourney(false)}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </article>
            )}
        </section>
    );
};

export default Tournaments;
