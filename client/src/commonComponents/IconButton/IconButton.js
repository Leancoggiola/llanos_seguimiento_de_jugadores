// Styling
import './IconButton.scss';

const IconButton = (props) => {
    const { children, className, disabled, href, onClick, type = 'button', innerRef } = props;
    const classes = `cc-icon-btn ${className ? className : ''}`;

    const handleClick = (e) => {
        e.preventDefault();
        onClick(e);
    };

    return (
        <>
            {href ? (
                <a className={classes}>{children}</a>
            ) : (
                <button type={type} className={classes} disabled={disabled} onClick={(e) => handleClick(e)} ref={innerRef}>
                    {children}
                </button>
            )}
        </>
    );
};

export default IconButton;
