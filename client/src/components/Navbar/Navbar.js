import { useState } from 'react';
// Components
import IconButton from '../../commonComponents/IconButton';
import Icon from '../../commonComponents/Icon';
import { contentIcTShirt, contentIcTeam, contentIcTrophy, testIc } from '../../assets/icons';
// Assets
import allAppsLogo from '../../assets/all-apps-icon.png';
// Middleware
//import { changeListToDisplay } from '../../middleware/actions/narBarActions'
// Styling
import './Navbar.scss';

const Navbar = ({isCollapse}) => {
    const [ activeIndex, setActiveIndex] = useState(0);

    // const dispath = useDispatch()

    const handleClick = (index, appName) => {
        setActiveIndex(index);
        //dispath(changeListToDisplay(appName))
    }

    const getActiveButton = (activeIndex, index) => {
        return activeIndex === index ? 'active' : '';
    }

    return (
        <nav className={`navigation ${isCollapse ? 'navigation-collapse' : 'navigation-expanded'}`}>
            <IconButton className={`${getActiveButton(activeIndex, 0)}`} onClick={() => handleClick(0, 'tourneys')}>
                <Icon src={contentIcTrophy}/>
                <h1>{'Torneos'}</h1>
            </IconButton>
            <IconButton className={`${getActiveButton(activeIndex, 1)}`} onClick={() => handleClick(1, 'teams')}>
                <Icon src={contentIcTeam}/>
                <h1>{'Equipos'}</h1>
            </IconButton>
            <IconButton className={`${getActiveButton(activeIndex, 2)}`} onClick={() => handleClick(2, 'players')}>
                <Icon src={contentIcTShirt}/>
                <h1>{'Jugadores'}</h1>
            </IconButton>
        </nav>
    )
}

export default Navbar;