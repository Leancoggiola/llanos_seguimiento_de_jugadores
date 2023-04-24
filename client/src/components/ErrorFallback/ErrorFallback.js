import Button from '../../commonComponents/Button';
// Styling
import './ErrorFallback.scss';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="error-fallback">
            <div className="no-content-found">
                <p className="main-text">{error.message}</p>
                <p className="main-text">
                    Algo salio mal. Es necesario recargar la pagina o intentar mas tarde.
                </p>
                <Button type="button" onClick={() => resetErrorBoundary()}>
                    Reintentar
                </Button>
            </div>
        </div>
    );
};

export default ErrorFallback;
