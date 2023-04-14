// Components
import { contentIcRemove, navigationIcCheck } from '../../../assets/icons';
import Icon from '../../Icon';
// Styling
import './SelectCheckbox.scss';

const SelectCheckbox = (props) => {
    const { selected = false, indeterminate = false, onClick = null } = props;

    const classes = `cc-select-checkbox ` +
    `${selected ? 'cc-select-checkbox-selected ' : ''}` +
    `${indeterminate ? 'cc-select-checkbox-indeterminate ' : ''}`;

    const handleClickCheckBox = () => {
        if (onClick) {
          onClick();
        }
      };

    return (
        <div className={classes} onClick={handleClickCheckBox}>
            <Icon src={navigationIcCheck} className='cc-select-checkbox-icon-selected'/>
            <Icon src={contentIcRemove} className='cc-select-checkbox-icon-indeterminate'/>
        </div>
    );
}

export default SelectCheckbox;