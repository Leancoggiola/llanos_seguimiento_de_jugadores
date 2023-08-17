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
import TeamCard from '../../components/TeamCard';
import TeamForm from '../../components/TeamForm';
// Middleware
import { navbarBack, navbarNewEntry } from '../../middleware/actions/navbarActions';
// Styling
import './Teams.scss';

const Teams = () => {
    const teamList = useSelector((state) => state.team.teamList);
    const [teamForm, setTeamForm] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [textFilter, setTextFilter] = useState('');

    const dispatch = useDispatch();

    const handleABMTeam = () => {
        setTeamForm(true);
        dispatch(navbarNewEntry({ action: setTeamForm, param: false }));
    };

    useEffect(() => {
        !teamForm && setSelectedTeam(null);
    }, [teamForm]);

    useEffect(() => {
        selectedTeam && handleABMTeam();
    }, [selectedTeam]);

    if (teamList.error) return <ErrorMessage message={teamList.error.message} />;

    const applyFilter = (data) => {
        if (textFilter) {
            return data.filter((x) => x.name.toLowerCase().includes(textFilter.toLowerCase()));
        }
        return data;
    };

    return (
        <section className="team-page-container">
            {teamForm && <TeamForm onClose={() => dispatch(navbarBack())} team={selectedTeam} />}
            {!teamForm && (
                <>
                    <FormField className="team-page-container-filter">
                        <Label>Nombre...</Label>
                        <Input type="text" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
                    </FormField>
                    {!isEmpty(teamList.data) && applyFilter(teamList.data).map((team, index) => <TeamCard key={team.name + index} team={team} setSelectedTeam={setSelectedTeam} />)}
                    <IconButton className="add-new" onClick={handleABMTeam}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Teams;
