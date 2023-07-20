// Styling
import './Icon.scss';

const Icon = (props) => {
    const { src, className, title } = props;
    const classes = `cc-icon ${className ? className : ''}`;

    return <span className={classes} dangerouslySetInnerHTML={{ __html: decodeURIComponent(src.replace(/data:image\/svg\+xml,/, '')) }} title={title} />;
};

export default Icon;
