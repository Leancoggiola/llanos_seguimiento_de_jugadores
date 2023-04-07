import { memo } from 'react';
// Components
import Theme from '../../commonComponents/Theme';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Styling
import './InprogressFallback.scss'


const InprogressFallback = memo((props) => {
    return(
        <>
            <Theme variant='default' />
            <LoadingSpinner fullscreen={true} />
            <div className='inprogress-text'>{props.status}</div>
        </>
    )
})

export default InprogressFallback;