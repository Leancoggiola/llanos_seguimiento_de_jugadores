import { omit } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import ReactDatePicker from 'react-date-picker';
import { FormFieldContext } from '../contexts';
// Components
import Icon from '../Icon';
// Assets
import { actionIcDateRange } from '../../assets/icons';
// Styling
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import './DatePicker.scss';

let nextUniqueId = 0;

const DatePicker = (props) => {
    const {
        className = '',
        format = 'y-MM-dd',
        value: valueProp = null,
        todayMark = false,
        onClick = () => null,
        onChange = () => null,
        onFocus = () => null,
        onCalendarOpen = () => null,
        onCalendarClose = () => null,
        disabled = false,
        required = false,
        minDate = null,
        maxDate = null,
        onlyIcon = false,
    } = props;

    const others = omit(props, [
        'className',
        'format',
        'value',
        'todayMark',
        'onClick',
        'onChange',
        'onFocus',
        'onCalendarOpen',
        'onCalendarClose',
        'disabled',
        'required',
        'minDate',
        'maxDate',
    ]);

    const formField = useContext(FormFieldContext);
    const [isOpen, setIsOpen] = useState(false);

    // act as controlled component through valueProp or
    // act as uncontrolled component through formField.value
    const value = valueProp || formField.value || null;

    useEffect(() => {
        formField.setFormElementType('dateInput');
        formField.setId(`cc-date-picker-${nextUniqueId++}`);
    }, []);

    useEffect(() => {
        formField.setHasContent(value && typeof value === 'object');
    }, [value]);

    useEffect(() => {
        if (formField.id && onlyIcon) {
            document.querySelector(`#${formField.id}`).querySelector('.react-date-picker__inputGroup').style.display = 'none';
        }
    }, [formField.id, onlyIcon]);

    // keep formField state in sync with controlled values
    useEffect(() => {
        formField.setValue(valueProp);
    }, [valueProp]);

    useEffect(() => {
        formField.setRequired(required);
    }, [required]);

    useEffect(() => {
        formField.setDisabled(disabled);
    }, [disabled]);

    useEffect(() => {
        setIsOpen(formField.isFocused);
    }, [formField.isFocused]);

    const handleChange = (date) => {
        // if uncontrolled component, set formField value
        // otherwise useEffect above will update formField value
        if (!valueProp) {
            formField.setValue(date);
        }
        onChange(date);
    };

    const handleFocus = (e) => {
        formField.toggleFocus(true);
        onFocus(e);
    };

    const handleClick = (e) => {
        if (disabled) return;
        formField.toggleFocus(true);
        onClick(e);
    };

    const handleCalendarOpen = (e) => {
        onCalendarOpen(e);
    };

    const handleCalendarClose = (e) => {
        formField.toggleFocus(false);
        onCalendarClose(e);
    };

    const classes =
        'cc-date-picker' +
        `${formField.hasContent || value ? ' cc-date-picker-has-value' : ''}${formField.invalid ? ' cc-date-picker-invalid' : ''}${
            !formField.isFocused ? ' cc-date-picker-not-focused' : ''
        }${todayMark ? ' cc-date-picker-today-highlight' : ''}${className ? ' ' + className : ''}`;

    const datePickerProps = {
        name: formField.id,
        format,
        disabled,
        formatShortWeekday: (locale, date) => date.toLocaleString(locale, { weekday: 'narrow' }),
        next2Label: null,
        prev2Label: null,
        clearIcon: null,
        calendarClassName: 'cc-calendar',
        calendarIcon: <Icon className="cc-calendar-icon" src={actionIcDateRange} />,
        className: classes,
        onFocus: handleFocus,
        onChange: handleChange,
        onCalendarClose: handleCalendarClose,
        onCalendarOpen: handleCalendarOpen,
        onClick: handleClick,
        value,
        isOpen,
        minDate,
        maxDate,
        ...others,
    };

    return (
        <div className={`cc-date-picker-wrapper${onlyIcon ? ' cc-date-picker-wrapper__only-icon' : ''}`}>
            <ReactDatePicker {...datePickerProps} />
        </div>
    );
};

export default DatePicker;
