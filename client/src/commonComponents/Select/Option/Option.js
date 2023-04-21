import { cloneElement, useContext, useEffect, useRef, useState } from 'react';
import { SelectContext } from '../../contexts';
// Components
import { DefaultOptionTemplate } from '../../Templates';
import SelectCheckbox from '../SelectCheckbox/SelectCheckbox';
// Styling
import './Option.scss';

const Option = (props) => {
    const { children, value, disabled, label, onClick, optionIndex, isSelected, className } = props;

    const [isOptionSelected, setIsOptionSelected] = useState(isSelected);

    const {
        id,
        setOptionSelected,
        setSelectValue,
        setDisplayedValue,
        setIsOpen,
        selectTriggerRef,
        optionCurrent,
        setOptionCurrent,
        multiple,
        searchOption,
        totalOptions,
        setHasSelectedMultipleOption,
    } = useContext(SelectContext);

    const optionRef = useRef();

    const parsedChildrenOption = (childrenOption) => {
        if (typeof childrenOption === 'object') {
            return cloneElement(children, {
                searchTerm: searchOption,
                value: label,
            });
        }

        return <DefaultOptionTemplate searchTerm={searchOption} value={childrenOption} />;
    };

    useEffect(() => {
        if (optionIndex === optionCurrent) {
            optionRef.current.focus();
        }
    }, [optionCurrent]);

    useEffect(() => {
        setIsOptionSelected(isSelected);
    }, [isSelected]);

    const handleClickSingle = () => {
        setSelectValue(value);
        setDisplayedValue(
            typeof children === 'undefined'
                ? 'undefined'
                : typeof children === 'object'
                ? label
                : children
        );
        setOptionSelected(optionIndex);
        setOptionCurrent(optionIndex);
        setIsOpen(false);
        selectTriggerRef.current.focus();
    };

    const handleClickMultiple = () => {
        setSelectValue((prevState) => {
            if (prevState.includes(value)) {
                return prevState.filter((val) => val !== value);
            }
            return [...prevState, value];
        });

        setDisplayedValue((prevState) => {
            const valueShowed =
                typeof children === 'undefined'
                    ? 'undefined'
                    : typeof children === 'object'
                    ? label
                    : children;
            if (prevState.includes(valueShowed)) {
                return prevState.filter((val) => val !== valueShowed);
            }
            return [...prevState, valueShowed];
        });

        setOptionSelected((prevState) => {
            if (prevState.includes(optionIndex)) {
                return prevState.filter((val) => val !== optionIndex);
            }
            return [...prevState, optionIndex];
        });

        setHasSelectedMultipleOption(true);
        setIsOptionSelected(!isOptionSelected);
    };

    const handleClick = () => {
        if (!disabled) {
            if (multiple) {
                handleClickMultiple();
            } else {
                handleClickSingle();
            }

            if (onClick) {
                onClick();
            }
        }
    };

    const classes =
        `cc-option ` +
        `${className ? className : ''}` +
        `${optionCurrent === optionIndex ? 'cc-option-current ' : ''}` +
        `${disabled ? 'cc-option-disabled ' : ''}`;

    return (
        <div id={id + '-' + optionIndex} ref={optionRef} className={classes} onClick={handleClick}>
            {multiple && totalOptions > 0 && <SelectCheckbox selected={isOptionSelected} />}
            {parsedChildrenOption(children)}
        </div>
    );
};

export default Option;
