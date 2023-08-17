import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircle } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import FormField from '../../commonComponents/FormField';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
import TourneyCard from '../../components/TourneyCard';
import TourneyDetails from '../../components/TourneyDetails';
import TourneyForm from '../../components/TourneyForm';
// Middleware
import { navbarBack, navbarNewEntry } from '../../middleware/actions/navbarActions';
// Styling
import './Tournaments.scss';

const Tournaments = () => {
    const [tourneyForm, setTourneyForm] = useState(false);
    const [tourneyDetails, setTourneyDetails] = useState(false);
    const [optionSelected, setOption] = useState('');
    const [textFilter, setTextFilter] = useState('');
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

    if (tourneyList.error || tourneyCrud.error) return <ErrorMessage message={tourneyList?.error ? tourneyList.error.message : tourneyCrud.error.message} />;

    if (tourneyList.loading || tourneyCrud.loading) {
        return (
            <section className="tournament-page-container">
                <LoadingSpinner fullscreen={true} />
            </section>
        );
    }

    const applyFilter = (data) => {
        if (textFilter) {
            return data.filter((x) => x.name.toLowerCase().includes(textFilter.toLowerCase()));
        }
        return data;
    };

    return (
        <section className="tournament-page">
            {tourneyForm && <TourneyForm onClose={() => dispatch(navbarBack())} tourney={selectedTourney} />}
            {tourneyDetails && <TourneyDetails onClose={() => dispatch(navbarBack())} tourney={selectedTourney} option={optionSelected} setOption={setOption} />}
            {!tourneyForm && !tourneyDetails && (
                <article className="tournament-page-main">
                    <FormField>
                        <Label>Nombre...</Label>
                        <Input type="text" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
                    </FormField>
                    <div className="tournament-page-main-cards">
                        {!isEmpty(tourneyList.data) &&
                            applyFilter(tourneyList.data).map((tourney, index) => (
                                <TourneyCard
                                    key={tourney.name + index}
                                    tourney={tourney}
                                    setTourneyForm={setTourneyForm}
                                    setOption={setOption}
                                    setSelectedTourney={setSelectedTourney}
                                />
                            ))}
                    </div>
                    <IconButton className="add-new" onClick={() => setTourneyForm(true)}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </article>
            )}
        </section>
    );
};

export default Tournaments;
