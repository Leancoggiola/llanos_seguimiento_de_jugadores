import { useContext } from 'react';
import { FormFieldContext } from '../contexts'
import { omit } from 'lodash';
// Styling
import './Label.scss'

const Label = (props) => {
    const { children, className } = props;
    const others = omit(props, ['children', 'className']);
    const { disabled, id } = useContext(FormFieldContext)
    
    const classes = `cc-label ` +
        `${className ? className : ''}` +
        `${disabled ? 'cc-label-disabled ' : ''}`;
    
    return (
        <label className={classes} htmlFor={id} {...others}>
            {children}
        </label>
    )
}

export default Label;