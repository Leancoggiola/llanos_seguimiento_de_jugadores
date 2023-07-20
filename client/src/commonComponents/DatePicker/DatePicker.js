import { omit } from 'lodash';
import { forwardRef, useContext, useEffect } from 'react';
import ReactDatePicker, { CalendarContainer } from 'react-datepicker';
import { FormFieldContext } from '../contexts';
// Components
import Icon from '../Icon';
import IconButton from '../IconButton';
// Assets
import { actionIcDateRange, navigationIcChevronLeft, navigationIcChevronRight } from '../../assets/icons';
// Styling
import './DatePicker.scss';

let nextUniqueId = 0;

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
function convertToSpanish(day) {
    const days = {
        Monday: 'L',
        Tuesday: 'M',
        Wednesday: 'X',
        Thursday: 'J',
        Friday: 'V',
        Saturday: 'S',
        Sunday: 'D',
    };
    return days[day];
}

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

    const CustomIconInput = forwardRef(({ onClick, disabled }, ref) => (
        <IconButton onClick={onClick} innerRef={ref} disabled={disabled}>
            <Icon className="cc-calendar-icon" src={actionIcDateRange} />
        </IconButton>
    ));

    const CustomHeader = (props) => {
        const { date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled } = props;
        return (
            <div className="react-datepicker__header cc-date-picker-calendar__header">
                <IconButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                    <Icon src={navigationIcChevronLeft} />
                </IconButton>
                <div className="react-datepicker__current-month">
                    {MESES[date.getMonth()]} {date.getFullYear()}
                </div>
                <IconButton onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                    <Icon src={navigationIcChevronRight} />
                </IconButton>
            </div>
        );
    };

    const datePickerProps = {
        name: formField.id,
        dateFormat: format,
        calendarClassName: 'cc-date-picker-calendar',
        className: classes,
        formatWeekDay: (day) => convertToSpanish(day),
        onFocus: handleFocus,
        onChange: handleChange,
        onCalendarClose: handleCalendarClose,
        onCalendarOpen: handleCalendarOpen,
        onInputClick: handleClick,
        selected: value,
        minDate,
        maxDate,
        withPortal: true,
        portalId: formField.id,
        renderCustomHeader: CustomHeader,
        customInput: <CustomIconInput />,
        disabledKeyboardNavigation: true,
        ...others,
    };

    return (
        <CalendarContainer className="cc-date-picker-wrapper">
            <ReactDatePicker {...datePickerProps} />
        </CalendarContainer>
    );
};

export default DatePicker;
