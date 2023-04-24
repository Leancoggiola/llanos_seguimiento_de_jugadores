import { omit } from 'lodash';
// Styling
import './Card.scss';

const Card = (props) => {
    const { children, className, other = omit(props, ['children', 'className']) } = props;
    const classes = `cc-card ${className ? className : ''}`;

    return (
        <div className={classes} {...other}>
            {children}
        </div>
    );
};

const CardHeader = (props) => {
    const { children, className, other = omit(props, ['children', 'className']) } = props;
    const classes = `cc-card-header ${className ? className : ''}`;

    return (
        <div className={classes} {...other}>
            {children}
        </div>
    );
};

const CardBody = (props) => {
    const { children, className } = props;
    const classes = `cc-card-body ${className ? className : ''}`;

    return <div className={classes}>{children}</div>;
};

const CardFooter = (props) => {
    const { children, className } = props;
    const classes = `cc-card-footer ${className ? className : ''}`;

    return <div className={classes}>{children}</div>;
};

const CardImage = (props) => {
    const { children, className } = props;
    const classes = `cc-card-image ${className ? className : ''}`;

    return <div className={classes}>{children}</div>;
};

export { Card, CardHeader, CardBody, CardFooter, CardImage };
