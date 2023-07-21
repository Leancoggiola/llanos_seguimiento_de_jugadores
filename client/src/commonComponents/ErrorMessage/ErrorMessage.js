// Components
import Button from '../Button';
import Icon from '../Icon';
import { alertIcError } from '../../assets/icons';
// Styling
import './ErrorMessage.scss';

const ErrorMessage = (props) => {
    const { error, message, className } = props;
    const classes = `cc-error ${className ? className : ''}`;

    return (
        <div className={classes}>
            <div className="cc-error-headline">
                <Icon className="cc-error-headline-icon" src={alertIcError} />
                <h1 className="cc-error-headline-msg">{error ? error : 'Error'}</h1>
            </div>
            <h2 className="cc-error-msg">{message}</h2>
            <Button className="cc-error-msg" onClick={() => window.location.reload(true)}>
                Intente más tarde
            </Button>
        </div>
    );
};

export default ErrorMessage;
