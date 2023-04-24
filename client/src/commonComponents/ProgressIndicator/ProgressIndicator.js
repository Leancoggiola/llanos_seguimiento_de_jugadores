import { omit } from 'lodash';
// Styling
import './ProgressIndicator.scss';

const ProgressIndicator = (props) => {
    const { children, className = '', variant = 'row' } = props;
    const other = omit(props, ['children', 'className', 'variant']);

    const classes =
        `cc-progress-indicator ` +
        `${className ? className : ''}` +
        `cc-progress-indicator-direction-${variant}`;

    return (
        <div {...other} className={classes}>
            {children}
        </div>
    );
};

export default ProgressIndicator;
