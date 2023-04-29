import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import TourneyCard from '../../components/TourneyCard';
import TourneyDetails from '../../components/TourneyDetails';
import TourneyForm from '../../components/TourneyForm';
import { contentIcAddCircle } from '../../assets/icons';
// Middleware
import { navbarBack, navbarNewEntry } from '../../middleware/actions/navbarActions';
// Styling
import './Tournaments.scss';

const Tournaments = () => {
    const [tourneyForm, setTourneyForm] = useState(false);
    const [tourneyDetails, setTourneyDetails] = useState(false);
    const [optionSelected, setOption] = useState('');
    const [selectedTourney, setSelectedTourney] = useState(null);

    const tourneyList = useSelector((state) => state.tourney.tourneyList);
    const tourneyCrud = useSelector((state) => state.tourney.crud);

    const dispatch = useDispatch();

    useEffect(() => {
        if (optionSelected !== '') {
            setTourneyDetails(true);
            dispatch(navbarNewEntry({ action: setOption, param: '' }));
        } else {
            setTourneyDetails(false);
            setSelectedTourney(null);
        }
    }, [optionSelected]);

    useEffect(() => {
        if (tourneyForm) {
            dispatch(navbarNewEntry({ action: setTourneyForm, param: '' }));
        } else {
            setSelectedTourney(null);
        }
    }, [tourneyForm]);

    if (tourneyList.error || tourneyCrud.error)
        return (
            <ErrorMessage
                message={tourneyList?.error ? tourneyList.error.message : tourneyCrud.error.message}
            />
        );

    if (tourneyList.loading || tourneyCrud.loading) {
        return <LoadingSpinner fullscreen={true} />;
    }

    return (
        <section className="tournament-page-container">
            {tourneyForm && (
                <TourneyForm onClose={() => dispatch(navbarBack())} tourney={selectedTourney} />
            )}
            {tourneyDetails && (
                <TourneyDetails
                    onClose={() => dispatch(navbarBack())}
                    tourney={selectedTourney}
                    option={optionSelected}
                    setOption={setOption}
                />
            )}
            {!tourneyForm && !tourneyDetails && (
                <article>
                    {!isEmpty(tourneyList.data) &&
                        tourneyList.data.map((tourney, index) => (
                            <TourneyCard
                                key={tourney.name + index}
                                tourney={tourney}
                                setTourneyForm={setTourneyForm}
                                setOption={setOption}
                                setSelectedTourney={setSelectedTourney}
                            />
                        ))}
                    <IconButton className="add-new" onClick={() => setTourneyForm(true)}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </article>
            )}
        </section>
    );
};

export default Tournaments;
