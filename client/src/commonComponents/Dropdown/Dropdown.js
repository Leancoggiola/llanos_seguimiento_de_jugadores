import { Children, cloneElement, useEffect, useRef, useState, forwardRef} from 'react';
// Styling
import './Dropdown.scss'

const Dropdown = forwardRef((props, ref) => {
    const { children, open, trigger, id, handleClickOutside, className} = props;
    const dropdown= useRef(null);
    const triggerRef = useRef();
    const target = useRef(null)

    const [ dropUp, setDropUp ] = useState(false);
    const [ openDropdown, setOpenDropdown] = useState(false);
    const [ currentItem, setCurrentItem] = useState(-1);

    const itemsChildren = Children.map(children, (child, index) => {
        return cloneElement(child, { indexItem: index, currentItem: currentItem})
    })

    const triggerButton = Children.map(trigger, (child) => {
        return cloneElement(child, { ref: triggerRef })
    })

    useEffect(() => {
        setOpenDropdown(open)
    }, [open])

    useEffect(() => {
        if(dropdown && dropdown.current && open) {
            const rect = dropdown.current.getBoundingClientRect();
            setDropUp(rect.bottom > window.innerHeight)
        }
    }, [open])

    useEffect(() => {
        document.addEventListener('click', clickOutside)
        return () => document.removeEventListener('click', clickOutside)
    }, [])

    const clickOutside = (event) => {
        if(event?.target && target?.current && !target.current.contains(event.target)) {
            setDropUp(false);
            handleClickOutside(id);
        }
    }

    return(
        <div ref={target} className={`cc-dropdown ${className ? className : ''}`}>
            <div className='cc-dropdown-trigger'>
                {triggerButton}
            </div>
            <div className='cc-dropdown-menu' 
                    style={{ 
                        display: openDropdown ? 'block':'none', 
                        top: dropUp ? -(dropdown.current.getBoundingClientRect().height + 20) / 14 + 'rem' : '100%'
                    }}
                    id={id}
                    role='menu'
                    ref={dropdown}
            >{itemsChildren}
            </div>
        </div>
    )
})

const DropdownItem = (props) => {
    const { children, indexItem, currentItem, onClick} = props;
    const menuItemRef= useRef();

    useEffect(() => {
        if(currentItem === indexItem) {
            menuItemRef.current.focus()
        }
    }, [currentItem])

    return(
        <button ref={menuItemRef} role='menuitem' className='cc-dropdown-item' tabIndex='-1' onClick={() => onClick()}>
            {children}
        </button>
    )
}

export { Dropdown, DropdownItem }