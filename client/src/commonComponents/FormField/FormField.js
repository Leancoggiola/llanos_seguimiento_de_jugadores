import { useState } from 'react';
import { FormFieldProvider } from '../contexts';
// Styling
import './FormField.scss';

const FormField = (props) => {
    const { children, className } = props;
    const [disabled, setDisabled] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [isFocused, setFocus] = useState(false);
    const [isActive, setActive] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [required, setRequired] = useState(false);
    const [id, setId] = useState('');
    const [formElementType, setFormElementType] = useState(null);
    const [hasPlaceholder, setHasPlaceholder] = useState(null);
    const [value, setValue] = useState(null);

    const handleToggleFocus = (isFocusedValue) => {
        const focusValue = typeof isFocusedValue === 'boolean' ? isFocusedValue : !isFocused;
        setFocus(focusValue);
    };

    const classes =
        `cc-form-field ` +
        `${className ? className : ''}` +
        `${isFocused ? 'cc-form-field-focused ' : ''}` +
        `${hasPlaceholder ? 'cc-form-field-has-placeholder ' : ''}` +
        `${hasContent ? 'cc-form-field-has-value ' : ''}` +
        `${formElementType === 'textInput' ? 'cc-form-field-text-input ' : ''}` +
        `${formElementType === 'selectInput' ? 'cc-form-field-select-input ' : ''}`;

    const contextSettings = {
        disabled,
        formElementType,
        hasContent,
        hasPlaceholder,
        id,
        invalid,
        isActive,
        isFocused,
        required,
        value,
        setDisabled,
        setFormElementType,
        setHasPlaceholder,
        setHasContent,
        setId,
        setInvalid,
        setRequired,
        setValue,
        toggleFocus: handleToggleFocus,
        setActive,
    };
    return (
        <FormFieldProvider value={contextSettings}>
            <div className={classes}>{children}</div>
        </FormFieldProvider>
    );
};

export default FormField;
