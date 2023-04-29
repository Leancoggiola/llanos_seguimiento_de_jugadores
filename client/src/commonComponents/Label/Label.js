import { omit } from 'lodash';
import { useContext } from 'react';
import { FormFieldContext } from '../contexts';
// Styling
import './Label.scss';

const Label = (props) => {
    const { children, className } = props;
    const others = omit(props, ['children', 'className']);

    const { disabled, id, isFocused, invalid, formElementType, required } =
        useContext(FormFieldContext);

    const classes =
        `cc-label ` +
        `${className ? className : ''}` +
        `${isFocused ? 'cc-focus ' : ''}` +
        `${invalid ? 'cc-invalid ' : ''}` +
        `${disabled ? 'cc-disabled ' : ''}` +
        `${formElementType === 'textInput' ? 'cc-label-for-text ' : ''}` +
        `${formElementType === 'number' ? 'cc-label-for-numeric-input ' : ''}` +
        `${required ? 'cc-label-required ' : ''}`;

    return (
        <label className={classes} htmlFor={id} {...others}>
            {children}
        </label>
    );
};

export default Label;
