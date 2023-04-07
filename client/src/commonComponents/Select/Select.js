import { Children, cloneElement, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FormFieldContext, SelectProvider } from '../contexts';
import { usePopper } from 'react-popper';
// Components
import Option from './Option/Option';
import Icon from '../Icon';
import { navigationIcClose, navigationIcKeyboardArrowDown } from '../../assets/icons';
// Styling
import './Select.scss'
import IconButton from '../IconButton';

const Select = (props) => {
    const { children, id, required, value, placeholder, visibleOptions, onChange, disabled, className } = props;
    let nextUniqueId = 0;

    const [ isOpen, setIsOpen ] = useState(false);
    const [ optionSelected, setOptionSelected ] = useState(-1);
    const [ optionCurrent, setOptionCurrent ] = useState(-1);
    const [ selectValue, setSelectValue ] = useState(value || '');
    const [ displayedValue, setDisplayedValue ] = useState('');
    const [ optionsChildrenSorted, setOptionsChildrenSorted ] = useState(children);

    const selectWrapperRef = useRef();
    const selectTriggerRef = useRef();
    const wrapperOptionsRef = useRef();
    const firstRender = useRef(true)

    const totalOptions = Children.count(optionsChildrenSorted);
    const formFieldContext = useContext(FormFieldContext);

    const popper = usePopper(selectWrapperRef.current, wrapperOptionsRef.current, {
        placement: 'auto',
        modifiers: [{ name: 'offset', options: { offset: [0,0] } }, {
            name: 'flip',
            options: {
                allowedAutoPlacements: ['top', 'bottom']
            }
        }]

    })
    const { styles, attributes } = popper

    const optionsChildren = Children.map(children, (child, index) => {
        const optionValue = child.props.value;
        const isSelected = selectValue === optionValue;
        return cloneElement(child, {
            optionIndex: index,
            isSelected: isSelected
        })
    })

    useEffect(() => {
        if(selectValue) {
            const currentValue = optionsChildren.reduce((acc, curr) => {
                const { value, children, optionIndex } = curr.props;
                if(value === selectValue) {
                    acc.displayedValue = children;
                    acc.optionSelected = optionIndex;
                    acc.optionCurrent = optionIndex;
                }
                return acc;
            }, {})
            setDisplayedValue(currentValue.displayedValue);
            setOptionSelected(currentValue.optionSelected);
            setOptionCurrent(currentValue.optionCurrent);
        }
        setOptionsChildrenSorted(optionsChildren);

        formFieldContext.setDisabled(disabled);
        formFieldContext.setRequired(required);
        formFieldContext.setFormElementType('selectInput');
        formFieldContext.setHasPlaceholder(placeholder && placeholder.length > 0);
        id ? formFieldContext.setId(id) : formFieldContext.setId(nextUniqueId++);

        document.addEventListener('click', clickOutside)
        return() => {
            document.removeEventListener('click', clickOutside)
        }
    }, [])

    useEffect(() => {
        formFieldContext.setValue(selectValue);
        formFieldContext.setHasContent(selectValue.length > 0)
    }, [selectValue])

    useLayoutEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return
        }
        if(onChange) {
            onChange(selectValue)
        }
    }, [selectValue])

    const clickOutside = (event) => {
        if(!isOpen && event?.target && selectWrapperRef?.current && !selectWrapperRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    const handleCleanvalue = (e) => {
        e.preventDefault();
        setSelectValue('');
        setDisplayedValue('');
        setOptionCurrent(-1);
        selectTriggerRef.current.focus();
    }

    const classes = `cc-select ` +
    `${className ? className : ''}` +
    `${isOpen ? 'cc-select-open ' : ''}`;

    return (
        <SelectProvider value={{
            id: formFieldContext.id,
            optionSelected,
            setOptionSelected,
            selectValue,
            setSelectValue,
            setDisplayedValue,
            isOpen,
            setIsOpen,
            selectTriggerRef,
            optionCurrent,
            setOptionCurrent,
            totalOptions
        }}>
            <div id={formFieldContext.id} 
                ref={selectWrapperRef} 
                className={classes} 
                onFocus={() => formFieldContext.toggleFocus(true)}
                onBlur={() => formFieldContext.toggleFocus(false)}
            >
                <button ref={selectTriggerRef} 
                    type='button'
                    role='combobox' 
                    disabled={disabled} 
                    className='cc-select-input'
                    onClick={() => setIsOpen(!isOpen)}
                    >
                        {formFieldContext.isFocused && !formFieldContext.hasContent && placeholder}
                        <div className='cc-select-input-text'>
                            {displayedValue}
                        </div>
                        {displayedValue.length > 0 &&
                        <IconButton className='cc-select-input-clean' onClick={handleCleanvalue}>
                            <Icon src={navigationIcClose}/>
                        </IconButton>
                        }
                        <Icon src={navigationIcKeyboardArrowDown} className='cc-select-input-arrow'/>
                </button>
                <div className='cc-select-wrapper-options' ref={wrapperOptionsRef} style={styles.popper} {...attributes?.popper}>
                    <div role='listbox' 
                        id={formFieldContext.id + '-listbox'}
                        tabIndex='-1'
                        className='cc-select-options'
                        style={{ maxHeight: visibleOptions * 3 + 'rem'}}
                        >
                            {optionsChildrenSorted.length > 0 ? optionsChildrenSorted :
                            <Option disabled={true}>No hay opciones</Option>}
                    </div>
                </div>
            </div>
        </SelectProvider>
    )
}

export default Select;