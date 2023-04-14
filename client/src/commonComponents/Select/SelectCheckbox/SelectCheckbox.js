// Components
import { contentIcRemove, navigationIcCheck } from '../../../assets/icons';
import IconButton from '../../IconButton';
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
            <IconButton className='cc-select-checkbox-icon-selected' >
                <Icon src={navigationIcCheck} />
            </IconButton>
            <IconButton className='cc-select-checkbox-icon-indeterminate'>
                <Icon src={contentIcRemove} />
            </IconButton>
        </div>
    );
}

export default SelectCheckbox;