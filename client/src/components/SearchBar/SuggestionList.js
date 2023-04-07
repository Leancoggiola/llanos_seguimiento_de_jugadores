import { isEmpty } from 'lodash';
import { forwardRef, useEffect, useRef } from 'react';
// Components
import StatusPill from '../StatusPill/StatusPill';
import LoadingSpinner from '../../commonComponents/LoadingSpinner';
// Styling
import './SearchBar.scss'

const SuggestionList = forwardRef((props, ref) => {
    const { clickOutside, loading, data, showResultInfo } = props;
    const target = useRef(null)

    useEffect(() => {
        document.addEventListener('click', (e) => clickOutside(e, target))
        return () => document.removeEventListener('click', clickOutside)
    }, [])

    return (
        <div className='search-bar-suggestion-list' ref={target}>
            {loading ? 
            <LoadingSpinner showPosRelative={true} />
            :
            !isEmpty(data) ? 
                <div className='search-bar-result-container'>
                    {data.map((item) => (
                        <div className='search-bar-result-item' key={item.id} onClick={() => showResultInfo(item)}>
                            <span><b>{item.title}</b></span>
                            <span>{item.titleType}</span>
                            { item.status && <StatusPill status={item.status}/> }
                        </div>
                    ))}
                </div>
                :
                <div className='search-bar-no-results'>
                    <h4>No se encontraron resultados</h4>
                </div>
            }
        </div>
    )
})

export default SuggestionList;