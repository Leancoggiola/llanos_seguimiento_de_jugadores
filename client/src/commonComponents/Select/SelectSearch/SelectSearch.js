import { useContext, useEffect, useRef } from 'react';
import { SelectContext } from '../../contexts';
// Components
import { actionIcSearch } from '../../../assets/icons';
import Icon from '../../Icon';
import IconButton from '../../IconButton';
import SelectCheckbox from '../SelectCheckbox/SelectCheckbox';
// Styling
import './SelectSearch.scss';

const SelectSearch = (props) => {
    const {
        multiple,
        searchPlaceholder,
        searchOption,
        handleChangeSearch,
        isOpen,
        hasSelectedAllOptions,
        handleClickSearchCheckbox,
        totalOptions
      } = useContext(SelectContext);
     
    const selectSearchRef = useRef();

    useEffect(() => {
        if(isOpen) {
            selectSearchRef.current.focus()
        }
    }, [isOpen])
    
    const classes = `cc-select-search ` +
    `${totalOptions === 0 ? 'cc-select-search-no-results ' : ''}`;

    return (
        <div className={classes}>
            {multiple && (
                <SelectCheckbox
                onClick={handleClickSearchCheckbox}
                selected={hasSelectedAllOptions.selected}
                indeterminate={hasSelectedAllOptions.indeterminate}
                />
            )}
            <input
                ref={selectSearchRef}
                className="cc-select-search-input"
                type="text"
                placeholder={searchPlaceholder}
                value={searchOption}
                onChange={handleChangeSearch}
            />
            <Icon src={actionIcSearch} className='cc-select-search-icon'/>
        </div>
    )
}

export default SelectSearch;