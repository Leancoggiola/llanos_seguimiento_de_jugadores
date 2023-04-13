import { omit } from 'lodash';
import { useContext, useEffect } from 'react';
import { FormFieldContext } from '../contexts';

const Textarea = (props) => {
    const { 
        className='',
        disabled=false,
        id='',
        required=false,
        onBlur=()=>{},
        onChange=()=>{},
        onFocus=()=>{},
        value='',
        placeholder=''
    } = props;
    let nextUniqueId = 0;

    const others = omit(props, ['disabled', 'id', 'className', 'required', 'onBlur', 'onChange', 'onFocus', 'placeholder', 'value']);

    const formFieldContext = useContext(FormFieldContext);

    useEffect(() => {
        formFieldContext.setRequired(required);
        formFieldContext.setDisabled(disabled);
        formFieldContext.setFormElementType('textInput');

        id ? formFieldContext.setId(id) : formFieldContext.setId('cc-text-area-'+nextUniqueId++)
    }, [])

    useEffect(() => {
        formFieldContext.setValue(value);
        formFieldContext.setHasContent(value.length > 0);
    }, [value])

    const handleBlur = (event) => {
        formFieldContext.toggleFocus(event);
        onBlur(event)
    }

    const handleChange = (event) => {
        formFieldContext.setValue(event.target.value);
        onChange(event)
    }

    const handleFocus = (event) => {
        formFieldContext.toggleFocus(event);
        onFocus(event)
    }

    const classes = `cc-text-area ${formFieldContext.invalid ? 'cc-input-invalid ' : ''}${className ? className : ''}`;

    return (
        <div className='cc-input-component'>
            <textarea 
                id={formFieldContext.id}
                className={classes}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                value={value}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                {...others}
            />
        </div>
    )
}

export default Textarea;