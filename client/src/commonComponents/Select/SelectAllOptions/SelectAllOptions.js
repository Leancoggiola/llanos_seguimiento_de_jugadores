import { useContext } from 'react';
import { SelectContext } from '../../contexts';
// Components
import SelectCheckbox from '../SelectCheckbox/SelectCheckbox';
// Styling
import './SelectAllOptions.scss';

const SelectAllOptions = (props) => {
    const {
        hasSelectedAllOptions: { selected, indeterminate },
        handleClickSelectAll
    } = useContext(SelectContext);

    return (
        <div className="cc-select-all" onClick={handleClickSelectAll}>
            <SelectCheckbox selected={selected} indeterminate={indeterminate} />
            {selected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </div>
    );
}

export default SelectAllOptions;