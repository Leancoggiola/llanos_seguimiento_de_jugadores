import { useState } from 'react';
// Components
import IconButton from '../../commonComponents/IconButton';
import Icon from '../../commonComponents/Icon';
import Navbar from '../Navbar'

import { navigationIcMenu } from '../../assets/icons';
// Styling
import './Header.scss'

const Header = (props) => {
    const { search: SearchBar, profileMenu: ProfileMenu} = props;
    const [ isCollapse, setToggleNavBar] = useState(true)

    return (
        <>
            <header>
                <div className='header-menu'>
                    <IconButton type='button' onClick={() => setToggleNavBar(!isCollapse)} >
                        <Icon src={navigationIcMenu} />
                    </IconButton>
                </div>
                { SearchBar && <div className='header-search'><SearchBar/></div> }
                { ProfileMenu && <div className='header-profile'><ProfileMenu /></div> }
            </header>
            <Navbar isCollapse={isCollapse}/>
        </>

    )
}

export default Header;