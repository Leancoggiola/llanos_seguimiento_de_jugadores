import { omit } from 'lodash';
import { useContext } from 'react';
import { AccordionContext } from '../../contexts';
// Components
import {
    contentIcAdd,
    contentIcRemove,
    navigationIcExpandLess,
    navigationIcExpandMore,
} from '../../../assets/icons';
import Icon from '../../Icon';
// Styling
import './AccordionTrigger.scss';

const AccordionTrigger = (props) => {
    const { children, className = '', triggerButtonProps = {}, icons = {} } = props;
    const other = omit(props, ['children', 'className', 'triggerButtonProps', 'icons']);

    const { toggleAccordion, useChevronIcon, visible } = useContext(AccordionContext);

    const classes = `cc-accordion-trigger ` + `${className ? className : ''}`;

    let collapseIcon = icons.collapse;
    let expandIcon = icons.expand;

    if (useChevronIcon) {
        collapseIcon = collapseIcon || (
            <Icon src={navigationIcExpandLess} className="cc-accordion-collapse-icon" />
        );
        expandIcon = expandIcon || (
            <Icon src={navigationIcExpandMore} className="cc-accordion-expand-icon" />
        );
    } else {
        collapseIcon = collapseIcon || (
            <Icon src={contentIcRemove} className="cc-accordion-collapse-icon" />
        );
        expandIcon = expandIcon || <Icon src={contentIcAdd} className="cc-accordion-expand-icon" />;
    }

    return (
        <button type="button" onClick={toggleAccordion} className={classes} {...triggerButtonProps}>
            <div className="cc-accordion-icons">
                {expandIcon}
                {collapseIcon}
            </div>
            <div className="cc-accordion-title-content" {...other}>
                {children}
            </div>
        </button>
    );
};

export default AccordionTrigger;
