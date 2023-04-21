import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircle } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
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

    const dispatch = useDispatch();

    const handleABMTeam = () => {
        setTeamForm(true);
        dispatch(navbarNewEntry({ action: setTeamForm, param: false }));
    };

    const handleClose = () => {
        setSelectedTeam(null);
        dispatch(navbarBack());
    };

    useEffect(() => {
        selectedTeam && handleABMTeam();
    }, [selectedTeam]);

    if (teamList.error) return <ErrorMessage message={teamList.error.message} />;

    return (
        <section className="team-page-container">
            {teamForm && <TeamForm onClose={handleClose} team={selectedTeam} />}
            {!teamForm && (
                <>
                    {!isEmpty(teamList.data) &&
                        teamList.data.map((team, index) => (
                            <TeamCard
                                key={team.name + index}
                                team={team}
                                setSelectedTeam={setSelectedTeam}
                            />
                        ))}
                    <IconButton className="add-new" onClick={handleABMTeam}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Teams;
