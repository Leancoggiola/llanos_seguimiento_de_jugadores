// Styling
import { forwardRef } from 'react';
import Icon from '../Icon';
import IconButton from '../IconButton';
import './Avatar.scss'

const Avatar = forwardRef((props,ref) => {
    const { name, onClick, user, icon, className } = props;

    const initials = 
        name?.match(/(\b\S)?/g)
            .join('')
            .split('@')[0]
            .replace(/./g,'')
            .slice(0, 2)
            .toUpperCase();

    return(
        <div className={'cc-avatar '+className} onClick={() => onClick()}>
            { icon ? 
            <IconButton>
                <Icon src={icon}/>
            </IconButton>
            : 
            user?.picture ?
            <img src={user.picture} alt={initials} />
            :
            <div className='cc-avatar-initials'>
                <span>{initials}</span>
            </div>
            }
        </div>
    )
})

export default Avatar;