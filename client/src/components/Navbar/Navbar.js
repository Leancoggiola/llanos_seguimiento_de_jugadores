import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// Components
import { contentIcTShirt, contentIcTeam, contentIcTrophy } from '../../assets/icons';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
// Middleware
import { changePageToDisplay } from '../../middleware/actions/navbarActions';
// Styling
import './Navbar.scss';

const Navbar = ({ isCollapse, setToggleNavBar }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const dispath = useDispatch();

    useEffect(() => {
        handleClick(1, 'equipos');
    }, []);

    const handleClick = (index, optionName) => {
        setActiveIndex(index);
        dispath(changePageToDisplay(optionName));
        setToggleNavBar(true);
    };

    const getActiveButton = (activeIndex, index) => {
        return activeIndex === index ? 'active' : '';
    };

    return (
        <nav className={`navigation ${isCollapse ? 'navigation-collapse' : 'navigation-expanded'}`}>
            <IconButton
                className={`${getActiveButton(activeIndex, 0)}`}
                onClick={() => handleClick(0, 'torneos')}
            >
                <Icon src={contentIcTrophy} />
                <h1>{'Torneos'}</h1>
            </IconButton>
            <IconButton
                className={`${getActiveButton(activeIndex, 1)}`}
                onClick={() => handleClick(1, 'equipos')}
            >
                <Icon src={contentIcTeam} />
                <h1>{'Equipos'}</h1>
            </IconButton>
            <IconButton
                className={`${getActiveButton(activeIndex, 2)}`}
                onClick={() => handleClick(2, 'jugadores')}
            >
                <Icon src={contentIcTShirt} />
                <h1>{'Jugadores'}</h1>
            </IconButton>
        </nav>
    );
};

export default Navbar;
