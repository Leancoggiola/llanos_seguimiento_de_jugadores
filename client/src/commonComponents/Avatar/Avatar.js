// Styling
import { forwardRef } from 'react';
import Icon from '../Icon';
import './Avatar.scss';

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
            { icon ? <Icon src={icon}/>
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