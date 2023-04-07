import ErrorMessage from '../../commonComponents/ErrorMessage/ErrorMessage';
// Styling
import './Unauthorized.scss'

const Unauthorized = (props) => {
    const { errorObj } = props;
    
    return (
        <ErrorMessage className={'unauthorized-container'} error={errorObj.error} message={errorObj.errorDescription}/>
    )
}

export default Unauthorized;