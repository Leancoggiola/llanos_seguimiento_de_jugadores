import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRect } from '../../hooks/useRect';
// Components
import { actionIcCheckCircle, actionIcInfo, alertIcError, alertIcWarning, navigationIcClose } from '../../assets/icons';
import Icon from '../Icon';
import IconButton from '../IconButton';
import ProgressBar from '../ProgressBar';
// Middleware
import { updateToastData } from '../../middleware/actions/navbarActions';
// Styling
import './Toast.scss';

const Toast = (props) => {
  const {
    show = false,
    actionName = null,
    actionOnClick = null,
    children,
    className = '',
    variant = 'info',
    position = '',
    closeButtonProps = {},
    actionButtonProps = {},
    closeBtn = true
  } = props;
  const actionRef = useRef(null);
  const rect = useRect(actionRef);
  const dispatch = useDispatch();
  const { width } = rect;

  const classes = `cc-toast ` +
  `${className ? className : ''}` +
  `${variant === 'success' ? 'cc-toast-success ' : ''}` +
  `${variant === 'error' ? 'cc-toast-error ' : ''}` +
  `${variant === 'warning' ? 'cc-toast-warning ' : ''}` +
  `${variant === 'info' ? 'cc-toast-info ' : ''}` +
  `${position === 'top' ? 'cc-toast-fixed-top ' : ''}` +
  `${position === 'bottom' ? 'cc-toast-fixed-bottom ' : ''}` +
  `${actionName ? 'cc-toast-has-action-button ' : ''}`;

  const handleClose = () => {
    dispatch(updateToastData({}))
  }

  return (
    <>
      {show && <div className={classes}>
        <div className="cc-toast-content">
          <div className="cc-toast-icon-container">
            <>
              {variant === 'error' && <Icon src={alertIcError} />}
              {variant === 'success' && <Icon src={actionIcCheckCircle} />}
              {variant === 'warning' && <Icon src={alertIcWarning} />}
              {variant === 'info' && <Icon src={actionIcInfo} />}
            </>
          </div>
          <div className="cc-toast-text-container" style={{ width: `calc(100% - ${90 + width}px)` }}>
            {children}
          </div>
          {actionName && (
            <button className="cc-toast-action-button" onClick={actionOnClick} ref={actionRef} {...actionButtonProps}>
              <span className="cc-toast-action-name">{actionName}</span>
            </button>
          )}
          {closeBtn &&
          <IconButton type="button" className="cc-toast-close-button" onClick={handleClose} {...closeButtonProps}>
            <Icon src={navigationIcClose}/>
          </IconButton>}
        </div>
        <ProgressBar value={100} isDecrease={true} className={`cc-toast-progress-${variant}`}/> 
      </div>}
    </>
  );
};

export default Toast ;
