// Styling
import './IconButton.scss'

const IconButton = (props) => {
    const { children, className, disabled, href, onClick, type } = props;
    const classes = `cc-icon-btn ${className ? className : ''}`;

    const handleClick = (e) => {
        e.preventDefault()
        onClick()
    }

    return (
        <>
            {href ?
            <a className={classes}>{children}</a>
            :
            <button type={type} className={classes} disabled={disabled} onClick={(e) => handleClick(e)} >
                {children}
            </button>
            }
        </>
    )
}

export default IconButton;