import { useContext, useEffect, useRef } from 'react';
import { SelectContext } from '../../contexts';
// Styling
import './Option.scss';

const Option = (props) => {
    const { children, value, disabled, onClick, optionIndex, className } = props;
    const selectContext = useContext(SelectContext)
    const { id, setOptionSelected, setSelectValue, setDisplayedValue, setIsOpen, selectTriggerRef, optionCurrent, setOptionCurrent } = selectContext;
    const optionRef = useRef();

    useEffect(() => {
        if(optionIndex === optionCurrent) {
            optionRef.current.focus()
        }
    }, [optionCurrent, optionIndex])
    
    const classes = `cc-option ` +
    `${className ? className : ''}` +
    `${optionCurrent === optionIndex ? 'cc-option-current ' : ''}` +
    `${disabled ? 'cc-option-disabled ' : ''}`;

    const handleClick = () => {
        if(!disabled) {
            setSelectValue(value);
            setDisplayedValue(children);
            setOptionSelected(optionIndex);
            setOptionCurrent(optionIndex);
            setIsOpen(false)
            selectTriggerRef.current.focus()

            if(onClick) {
                onClick()
            }
        }
    }

    return (
        <div id={id + '-' + optionIndex} ref={optionRef} className={classes} onClick={handleClick}>
            <span>{children}</span>
        </div>
    )
}

export default Option;