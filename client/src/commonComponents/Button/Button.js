import { omit } from 'lodash';
// Components
import Icon from '../Icon';
import { imageIcNavigateBefore, imageIcNavigateNext } from '../../assets/icons';
// Styling
import './Button.scss';

const Button = (props) => {
    const {
        variant = 'primary',
        className = '',
        disabled = false,
        size = null,
        children,
        stepper = null,
        type = 'submit',
        onClick = null,
    } = props;

    const other = omit(props, [
        'variant',
        'className',
        'disabled',
        'size',
        'children',
        'stepper',
        'type',
        'onClick',
    ]);

    const buttonType = variant === 'text' || variant === 'text-alt' ? 'isText' : 'isButton';

    const classes =
        `${buttonType === 'isText' && disabled ? 'cc-text-button-disabled ' : ''}` +
        `${
            buttonType === 'isButton' && children && stepper ? `cc-button-stepper-${stepper} ` : ''
        }` +
        `${buttonType === 'isText' ? `cc-${variant}-button ` : ''}` +
        `${buttonType === 'isButton' ? `cc-button cc-button-${variant} ` : ''}` +
        `${size ? `cc-button-${size} ` : ''}` +
        `${className ? className : ''}`;

    return (
        <button {...other} type={type} className={classes} disabled={disabled} onClick={onClick}>
            {stepper === 'prev' && <Icon src={imageIcNavigateBefore} />}
            {children}
            {stepper === 'next' && <Icon src={imageIcNavigateNext} />}
        </button>
    );
};

export default Button;
