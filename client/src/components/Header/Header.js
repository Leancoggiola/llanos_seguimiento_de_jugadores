import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Navbar from '../Navbar';

import { hardwareIcKeyboardArrowLeft, navigationIcMenu } from '../../assets/icons';
// Middleware
import { navbarBack } from '../../middleware/actions/navbarActions';
// Styling
import './Header.scss';

const Header = (props) => {
    const { profileMenu: ProfileMenu} = props;
    const [ isCollapse, setToggleNavBar] = useState(true);

    const dispatch = useDispatch();

    const position = useSelector((state) => state.navbar.navbarPosition)

    useEffect(() => {
        position.length > 0 && setToggleNavBar(true)
    }, [position])

    return (
        <>
            <header>
                <div className='header-menu'>
                    { position.length === 0 ? 
                        <IconButton type='button' onClick={() => setToggleNavBar(!isCollapse)} >
                            <Icon src={navigationIcMenu} />
                        </IconButton>
                        :
                        <IconButton type='button' onClick={() => dispatch(navbarBack())} >
                            <Icon src={hardwareIcKeyboardArrowLeft} />
                        </IconButton>
                    }
                </div>
                { ProfileMenu && <div className='header-profile'><ProfileMenu /></div> }
            </header>
            <Navbar isCollapse={isCollapse} setToggleNavBar={setToggleNavBar}/>
        </>

    )
}

export default Header;