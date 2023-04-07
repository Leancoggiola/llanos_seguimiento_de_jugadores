import { useContext, useEffect, useRef } from 'react';
import { FormFieldContext } from '../contexts';
import { navigationIcClose } from '../../assets/icons';
// Components
import IconButton from '../IconButton';
import Icon from '../Icon';
// Styling
import './Input.scss'

const Input = (props) => {
    const { 
        disabled=false,
        id='',
        className='',
        required=false,
        onBlur=()=>{},
        onChange=()=>{},
        onFocus=()=>{},
        placeholder='',
        type='text',
        value='',
        hideClearButton=true
    } = props;
    let nextUniqueId = 0;

    const formFieldContext = useContext(FormFieldContext);
    const inputValue = value.toString();
    const inputRef = useRef(null)

    useEffect(() => {
        formFieldContext.setRequired(required);
        formFieldContext.setDisabled(disabled);
        formFieldContext.setFormElementType('textInput');
        id ? formFieldContext.setId(id) : formFieldContext.setId('cc-input-'+nextUniqueId++)
    }, [])

    useEffect(() => {
        formFieldContext.setValue(inputValue);
        formFieldContext.setHasContent(inputValue.length > 0);
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

    const handleClear = () => {
        handleChange({target: { value: '' }});
        inputRef.current.focus();
    }

    const classes = `cc-input ${formFieldContext.invalid ? 'cc-input-invalid ' : ''}${className ? className : ''}`;

    return (
        <div className='cc-input-component'>
            <input id={formFieldContext.id}
                ref={inputRef}
                disabled={disabled}
                className={classes}
                type={type}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                value={inputValue}
                required={required}
                placeholder={placeholder}
            />
            {inputValue.length > 0 && !hideClearButton &&
            <IconButton className='cc-input-clear-button' onClick={handleClear} disabled={disabled}>
                <Icon src={navigationIcClose}/>
            </IconButton>
            }
        </div>
    )
}

export default Input;