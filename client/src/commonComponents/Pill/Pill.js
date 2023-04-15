// Styling
import './Pill.scss'

const PillGroup = (props) => {
    const { children, className } = props;
    const classes = `cc-pill-group ${className ? className : ''}`;

    return(<div className={classes}>{children}</div>)
}

const Pill = (props) => {
    const { children, className, variant = 'info' } = props;
    const classes = `cc-pill ${className ? className : ''}`;
    const btnClasses = `cc-pill-btn ${variant ? `cc-pill-${variant}` : ''}`
    return (
        <div className={classes}>
            <div className={btnClasses}>
                {children}
            </div>
        </div>
    )
}

export { PillGroup, Pill };