import { useContext } from 'react';
import AnimateHeight from 'react-animate-height';
import { AccordionContext } from '../../contexts';
import { omit } from 'lodash';
// Styling
import './AccordionContent.scss';

const AccordionContent = (props) => {
    const { children, className = '' } = props;
    const other = omit(props, ['children', 'className']);

    const { visible } = useContext(AccordionContext);

    const classes = `cc-accordion-content ` + `${className ? className : ''}`;

    return (
        <AnimateHeight duration={150} height={visible ? 'auto' : 0}>
            <div className={classes} {...other}>
                {children}
            </div>
        </AnimateHeight>
    );
};

export default AccordionContent;
