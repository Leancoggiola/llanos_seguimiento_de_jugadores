import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
// Components
import { actionIcExitToApp, actionIcSettings } from '../../assets/icons';
import Avatar from '../../commonComponents/Avatar';
import { Dropdown, DropdownItem } from '../../commonComponents/Dropdown';
import Icon from '../../commonComponents/Icon';
// Middleware
import { logOutUserRequest } from '../../middleware/actions/authActions';
// Styling
import './Profile.scss';

const Profile = () => {

    const [ isProfileMenuOpen, setProfileMenuOpen ] = useState(false);
    const [,, removeCookie] = useCookies(['jwt']);
    const dispatch = useDispatch();

    const logoutUser = () => {
        dispatch(logOutUserRequest())
        removeCookie('jwt')
        window.location.reload(false);
        return
    }

    const profileMenuOptions=[{
            id: 'header-profile-logout',
            optionFn: logoutUser,
            icon: actionIcExitToApp,
            description: 'Logout'
    }]

    return (
        <Dropdown 
            open={isProfileMenuOpen}
            id={'header-profile-dropdown'}
            handleClickOutside={() => setProfileMenuOpen(false)}
            className='header-profile-dropdown'
            trigger={
                <Avatar 
                    onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                    icon={actionIcSettings}
                    className='icon-avatar'
                />
            }
        >
            {profileMenuOptions.map(menuOption => {
                const { id, optionFn, icon, description } = menuOption;
                return(
                    <DropdownItem key={id} onClick={() => { setProfileMenuOpen(false); optionFn()}}>
                        <Icon src={icon} />
                        <span>{description}</span>
                    </DropdownItem>
                )
            })}
        </Dropdown>
    )
}

export default Profile;