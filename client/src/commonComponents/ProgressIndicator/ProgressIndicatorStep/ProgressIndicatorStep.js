import { omit } from 'lodash';
// Components
import Icon from '../../Icon';
import { notificationIcPriorityHigh, navigationIcCheck } from '../../../assets/icons';
// Styling
import './ProgressIndicatorStep.scss';

const radioButtonSvg = (
    <svg
        className="cc-progress-indicator-icon-svg"
        fill="currentColor"
        preserveAspectRatio="xMidYMid meet"
        height="24px"
        width="24px"
        viewBox="0 0 24 24"
    >
        <circle
            className="radio-outline"
            cx="12"
            cy="12"
            r="11"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
        />
        <circle className="radio-dot-active" cx="12" cy="12" r="7" fill="currentColor" />
        <circle className="radio-dot-hover" cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
);

const defaultIcons = {
    complete: <Icon src={navigationIcCheck} />,
    error: <Icon src={notificationIcPriorityHigh} />,
    incomplete: radioButtonSvg,
};

const ProgressIndicatorStep = (props) => {
    const {
        className = '',
        heading = '',
        body = '',
        status = 'default',
        error = false,
        disabled = false,
        onClick = null,
        icons: userIcons = {},
    } = props;

    const other = omit(props, [
        'className',
        'heading',
        'body',
        'status',
        'error',
        'disabled',
        'onClick',
        'icons',
    ]);

    const icons = {
        ...defaultIcons,
        ...userIcons,
    };

    const classes =
        `cc-progress-indicator-step ` +
        `${className ? className : ''}` +
        `${
            !error && !disabled && status?.length > 0 ? `cc-progress-indicator-step-${status}` : ''
        }` +
        `${error ? 'cc-progress-indicator-step-error ' : ''}` +
        `${disabled ? 'cc-progress-indicator-step-disabled' : ''}`;

    const getStatusA11y = (() =>
        `status: ${(error && 'error') || (disabled && 'disable') || status}.`)();

    return (
        <div {...other} className={classes} disabled={disabled} tabIndex={-1}>
            <button className="cc-progress-indicator-text-lines" onClick={onClick}>
                {heading && <p className="cc-progress-indicator-heading">{heading}</p>}
                {body && (
                    <>
                        <p aria-label={body} className="cc-progress-indicator-body">
                            {body}
                        </p>
                        <span style={{ color: 'transparent', fontSize: '0' }}>{getStatusA11y}</span>
                    </>
                )}
            </button>
            <div className="cc-progress-indicator-icon">
                {error || status === 'warning' ? icons.error : icons.complete}
                {icons.incomplete}
            </div>
        </div>
    );
};

export default ProgressIndicatorStep;
