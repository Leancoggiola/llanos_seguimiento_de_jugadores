
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircleOutline } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import TeamForm from '../../components/TeamForm';
import TeamCard from '../../components/TeamCard/TeamCard';
// Middleware
import { navbarNewEntry, navbarBack } from '../../middleware/actions/navbarActions';
// Styling
import './Teams.scss';

const Teams = () => {
    const teamList = useSelector((state) => state.team.teamList);
    const [ teamForm, setTeamForm ] = useState(true)

    const dispatch = useDispatch();

    const handleNewTeam = () => {
        setTeamForm(true)
        dispatch(navbarNewEntry({action: setTeamForm, param: false}))
    }
    
    if(teamList.error) return <ErrorMessage message={teamList.error.message} />

    return (
        <section className='team-page-container'>
            {teamForm && <TeamForm onClose={() => dispatch(navbarBack())} />}
            {!teamForm &&             
            <>
                {!isEmpty(teamList.data) && teamList.data.map((team, index) => (
                    <TeamCard key={team.name+index} team={team}/>
                ))}
                <IconButton className='add-new-team' onClick={handleNewTeam}>
                    <Icon src={contentIcAddCircleOutline}/>
                </IconButton>
            </>}
        </section>
    )
}

export default Teams;