// Styling
import './Icon.scss'

const Icon = (props) => {
    const { src, className, title } = props;
    const classes = `cc-icon ${className ? className : ''}`;

    function encodeSVG(data) {
        const test = data.match(/data:image\/svg\+xml,/);
        if(!data.match(/data:image\/svg\+xml,/)) {
            debugger
            data = data.replace(/\>[\t\s\n ]+\</g, "><"); // replace all BETWEEN tags
            data = data.replace(/#/g, "%23");
            data = data.replace(/"/g, "'");
            return data
        } else {
            return data.replace(/data:image\/svg\+xml,/, '')
        }
    }
    
    return (
        <span 
            className={classes}
            dangerouslySetInnerHTML={
                {__html: decodeURIComponent(encodeSVG(src))}
            }
            title={ title }
        />
    )
}

export default Icon;