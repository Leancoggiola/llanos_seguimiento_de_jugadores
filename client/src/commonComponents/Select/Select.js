import {
    Children,
    cloneElement,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { FormFieldContext, SelectProvider } from '../contexts';
import { usePopper } from 'react-popper';
// Components
import Option from './Option/Option';
import Icon from '../Icon';
import { navigationIcClose, hardwareIcKeyboardArrowDown } from '../../assets/icons';
import SelectAllOptions from './SelectAllOptions/SelectAllOptions';
import SelectSearch from './SelectSearch/SelectSearch';
// Styling
import './Select.scss';
import IconButton from '../IconButton';

let nextUniqueId = 0;
nextUniqueId = 0;

const Select = (props) => {
    const {
        children,
        id,
        required,
        value,
        placeholder,
        visibleOptions,
        onChange,
        multiple,
        showSelectAllButton,
        filter,
        searchPlaceholder,
        disabled,
        className,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [optionSelected, setOptionSelected] = useState(multiple ? [] : -1);
    const [optionCurrent, setOptionCurrent] = useState(-1);
    const [selectValue, setSelectValue] = useState(value || '');
    const [displayedValue, setDisplayedValue] = useState(multiple ? [] : '');
    const [hasSelectedAllOptions, setHasSelectedAllOptions] = useState({
        selected: false,
        indeterminate: false,
    });
    const [optionsChildrenSorted, setOptionsChildrenSorted] = useState(children);
    const [searchOption, setSearchOption] = useState('');
    const [hasSelectedMultipleOptions, setHasSelectedMultipleOption] = useState(false);

    const selectWrapperRef = useRef();
    const selectTriggerRef = useRef();
    const wrapperOptionsRef = useRef();
    const firstRender = useRef(true);

    const totalOptions = Children.count(optionsChildrenSorted);
    const formFieldContext = useContext(FormFieldContext);

    const popper = usePopper(selectWrapperRef.current, wrapperOptionsRef.current, {
        placement: 'auto',
        modifiers: [
            { name: 'offset', options: { offset: [0, 0] } },
            {
                name: 'flip',
                options: {
                    allowedAutoPlacements: ['top', 'bottom'],
                },
            },
        ],
    });
    const { styles, attributes } = popper;

    const optionsChildren = Children.map(children, (child, index) => {
        const optionValue = child.props.value;

        const isSelected = Array.isArray(selectValue)
            ? selectValue.includes(optionValue)
            : selectValue === optionValue;
        return cloneElement(child, {
            optionIndex: index,
            isSelected: isSelected,
        });
    });

    useEffect(() => {
        if (selectValue) {
            if (multiple || Array.isArray(selectValue)) {
                const valuesSelected = optionsChildren.reduce(
                    (acc, curr) => {
                        const { value, children, label, optionIndex } = curr.props;

                        if (selectValue.includes(value)) {
                            acc[0].push(
                                typeof children === 'undefined'
                                    ? 'undefined'
                                    : typeof children === 'object'
                                    ? label
                                    : children
                            );
                            acc[1].push(optionIndex);
                        }
                        return acc;
                    },
                    [[], []]
                );

                setDisplayedValue(valuesSelected[0]);
                setOptionSelected(valuesSelected[1]);
            } else {
                const currentValue = optionsChildren.reduce((acc, curr) => {
                    const { value, children, label, optionIndex } = curr.props;
                    if (value === selectValue) {
                        acc.displayedValue = typeof children === 'object' ? label : children;
                        acc.optionSelected = optionIndex;
                        acc.optionCurrent = optionIndex;
                    }
                    return acc;
                }, {});
                setDisplayedValue(currentValue.displayedValue);
                setOptionSelected(currentValue.optionSelected);
                setOptionCurrent(currentValue.optionCurrent);
            }
        }

        setOptionsChildrenSorted(optionsChildren);

        formFieldContext.setDisabled(disabled);
        formFieldContext.setRequired(required);
        formFieldContext.setFormElementType('selectInput');
        formFieldContext.setHasPlaceholder(placeholder && placeholder.length > 0);
        id ? formFieldContext.setId(id) : formFieldContext.setId('cc-select-' + nextUniqueId++);

        document.addEventListener('click', clickOutside);
        return () => {
            document.removeEventListener('click', clickOutside);
        };
    }, []);

    useEffect(() => {
        formFieldContext.setValue(selectValue);
        formFieldContext.setHasContent(selectValue.length > 0);
    }, [selectValue]);

    useEffect(() => {
        if (!hasSelectedMultipleOptions) {
            setOptionsChildrenSorted(optionsChildren);
        }
        setHasSelectedMultipleOption(false);
    }, [children]);

    useEffect(() => {
        if (multiple) {
            const childrenSorted = optionsChildrenSorted.map((option) => ({
                ...option,
                props: {
                    ...option.props,
                    isSelected: selectValue.includes(option.props.value),
                },
            }));
            setOptionsChildrenSorted(childrenSorted);
        }

        if (multiple && (showSelectAllButton || filter)) {
            const selectedOptions = optionsChildrenSorted.map(({ props: { value } }) => value);

            setHasSelectedAllOptions({
                selected:
                    selectValue.length > 0 &&
                    selectedOptions.every((opt) => selectValue.includes(opt)),
                indeterminate: selectedOptions.some((opt) => selectValue.includes(opt)),
            });
        }

        formFieldContext.setValue(selectValue);
        formFieldContext.setHasContent(
            selectValue.length > 0 || Object.keys(selectValue).length > 0
        );
    }, [selectValue]);

    useLayoutEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (onChange) {
            onChange(selectValue);
        }
    }, [selectValue]);

    const filterOptions = (options) => {
        const filteredOptions = options.filter(({ props: { children, label, value } }) => {
            if (typeof filter === 'function') {
                if (typeof value === 'undefined' ? 'undefined' : typeof value === 'object') {
                    return filter(searchOption, value);
                }
            }
            const option =
                typeof value === 'undefined'
                    ? 'undefined'
                    : typeof value === 'object'
                    ? label
                    : children;
            return option.toLowerCase().includes(searchOption.toLowerCase());
        });

        return Children.map(filteredOptions, (child, index) => {
            return cloneElement(child, { optionIndex: index });
        });
    };

    const sortOptions = (options) => {
        const optionsSelected = options.filter(({ props: { isSelected } }) => isSelected);
        const optionsNonSelected = options.filter(({ props: { isSelected } }) => !isSelected);

        const optionsSorted = [...optionsSelected, ...optionsNonSelected];

        return Children.map(optionsSorted, (child, index) =>
            cloneElement(child, {
                optionIndex: index,
            })
        );
    };

    useEffect(() => {
        if (!isOpen) {
            if (searchOption && multiple) {
                const filteredOptions = filterOptions(optionsChildren);
                const sortedOptions = sortOptions(filteredOptions);
                setOptionsChildrenSorted(sortedOptions);
            }

            if (searchOption && !multiple) {
                const filteredOptions = filterOptions(optionsChildren);
                setOptionsChildrenSorted(filteredOptions);
            }

            if (!searchOption && multiple) {
                const sortedOptions = sortOptions(optionsChildren);
                setOptionsChildrenSorted(sortedOptions);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        const filteredOptions = filterOptions(optionsChildren);

        if (multiple) {
            const optionsValue = filteredOptions.map(({ props: { value: val } }) => val);

            setHasSelectedAllOptions({
                selected:
                    optionsValue.length > 0 &&
                    optionsValue.every((opt) => selectValue.includes(opt)),
                indeterminate: optionsValue.some((opt) => selectValue.includes(opt)),
            });
        }

        setOptionsChildrenSorted(filteredOptions);
        setOptionCurrent(-1);
    }, [searchOption]);

    const clickOutside = (event) => {
        if (
            !isOpen &&
            event?.target &&
            selectWrapperRef?.current &&
            !selectWrapperRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    const handleClickSelectAll = () => {
        if (selectValue.length) {
            setSelectValue([]);
            setDisplayedValue([]);
            setOptionSelected([]);
            setHasSelectedAllOptions({ selected: false, indeterminate: false });
        } else {
            const selectedOptions = optionsChildren.reduce(
                (acc, { props: { value, children, label, optionIndex, disabled } }) => {
                    if (!disabled) {
                        const valueShowed = typeof children === 'object' ? label : children;
                        acc.selectValue = acc.selectValue ? [...acc.selectValue, value] : [value];
                        acc.displayedValue = acc.displayedValue
                            ? [...acc.displayedValue, valueShowed]
                            : [valueShowed];
                        acc.optionSelected = acc.optionSelected
                            ? [...acc.optionSelected, optionIndex]
                            : [optionIndex];
                    }

                    return acc;
                },
                {}
            );
            setSelectValue([...selectValue, ...selectedOptions.selectValue]);
            setDisplayedValue([...displayedValue, ...selectedOptions.displayedValue]);
            setOptionSelected([...optionSelected, ...selectedOptions.optionSelected]);
            setHasSelectedAllOptions({ selected: true, indeterminate: false });
        }
    };

    const handleChangeSearch = (event) => {
        setSearchOption(event.target.value);
    };

    const handleClickSearchCheckbox = () => {
        const selectedOptions = optionsChildrenSorted.reduce(
            (acc, { props: { value, children, label, optionIndex, disabled } }) => {
                if (disabled) {
                    acc.disabledOptions = acc.disabledOptions
                        ? [...acc.disabledOptions, value]
                        : [value];
                } else {
                    const valueShowed = typeof children === 'object' ? label : children;
                    acc.selectValue = acc.selectValue ? [...acc.selectValue, value] : [value];
                    acc.displayedValue = acc.displayedValue
                        ? [...acc.displayedValue, valueShowed]
                        : [valueShowed];
                    acc.optionSelected = acc.optionSelected
                        ? [...acc.optionSelected, optionIndex]
                        : [optionIndex];
                }
                return acc;
            },
            {}
        );

        const prevValuesSelected =
            selectValue &&
            selectValue.filter((value) => !selectedOptions.selectValue.includes(value));

        const prevDisplayedSelected =
            displayedValue &&
            displayedValue.filter((value) => !selectedOptions.displayedValue.includes(value));

        if (!hasSelectedAllOptions.selected && hasSelectedAllOptions.indeterminate) {
            if (selectedOptions.disabledOptions && selectedOptions.disabledOptions.length > 0) {
                setSelectValue([...prevValuesSelected]);
                setDisplayedValue([...prevDisplayedSelected]);
            } else {
                setSelectValue([...new Set([...selectValue, ...selectedOptions.selectValue])]);
                setDisplayedValue([
                    ...new Set([...displayedValue, ...selectedOptions.displayedValue]),
                ]);
            }
        } else if (hasSelectedAllOptions.selected && hasSelectedAllOptions.indeterminate) {
            setSelectValue([...prevValuesSelected]);
            setDisplayedValue([...prevDisplayedSelected]);
        } else {
            setSelectValue([...prevValuesSelected, ...selectedOptions.selectValue]);
            setDisplayedValue([...prevDisplayedSelected, ...selectedOptions.displayedValue]);
        }

        setHasSelectedMultipleOption(true);
    };

    const handleCleanValue = (e) => {
        e.preventDefault();
        setSelectValue('');
        setDisplayedValue('');
        setOptionCurrent(-1);
        selectTriggerRef.current.focus();
    };

    const classes =
        `cc-select ` +
        `${className ? className : ''}` +
        `${isOpen ? 'cc-select-open ' : ''}` +
        `${disabled ? 'cc-select-disabled ' : ''}`;

    return (
        <SelectProvider
            value={{
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
                multiple,
                searchPlaceholder,
                searchOption,
                handleClickSelectAll,
                handleChangeSearch,
                hasSelectedAllOptions,
                handleClickSearchCheckbox,
                totalOptions,
                setHasSelectedMultipleOption,
            }}
        >
            {!firstRender.current && (
                <div
                    id={formFieldContext.id}
                    ref={selectWrapperRef}
                    className={classes}
                    onFocus={() => formFieldContext.toggleFocus(true)}
                    onBlur={() => formFieldContext.toggleFocus(false)}
                >
                    <button
                        ref={selectTriggerRef}
                        type="button"
                        disabled={disabled}
                        className="cc-select-input"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {formFieldContext.isFocused && !formFieldContext.hasContent && placeholder}
                        <div className="cc-select-input-text">
                            {multiple ? displayedValue.filter(Boolean).join(', ') : displayedValue}
                        </div>
                        {!multiple && filter && displayedValue && displayedValue.length > 0 && (
                            <IconButton
                                className="cc-select-clean-value"
                                onClick={handleCleanValue}
                            >
                                <Icon src={navigationIcClose} />
                            </IconButton>
                        )}
                        <Icon src={hardwareIcKeyboardArrowDown} className="cc-select-input-arrow" />
                    </button>
                    <div
                        className="cc-select-wrapper-options"
                        ref={wrapperOptionsRef}
                        style={styles.popper}
                        {...attributes?.popper}
                    >
                        {multiple && showSelectAllButton && <SelectAllOptions />}
                        {filter && <SelectSearch />}
                        <div
                            id={formFieldContext.id + '-listbox'}
                            tabIndex="-1"
                            className="cc-select-options"
                            style={{ maxHeight: visibleOptions * 3 + 'rem' }}
                        >
                            {optionsChildrenSorted.length > 0 ? (
                                optionsChildrenSorted
                            ) : (
                                <Option disabled={true}>No hay opciones</Option>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </SelectProvider>
    );
};

export default Select;
