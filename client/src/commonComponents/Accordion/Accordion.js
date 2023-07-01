import { useState, useLayoutEffect, useRef } from 'react';
import { omit } from 'lodash';
// Components
import { AccordionProvider } from '../contexts';
// Styling
import './Accordion.scss';

const Accordion = (props) => {
    const { children, className = '', variant = 'functional', onOpen = null, onClose = null, open = null, useChevronIcon = false, alignIconRight = false } = props;
    const other = omit(props, ['children', 'className', 'variant', 'onOpen', 'onClose', 'open', 'useChevronIcon', 'alignIconRight']);

    const [localVisible, setLocalVisible] = useState(false);
    const firstUpdate = useRef(true);
    const isControlled = open !== null;
    const visible = isControlled ? open : localVisible;

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (isControlled) {
            open ? onOpen() : onClose();
        }
    });

    const toggleAccordion = () => {
        if (!visible && onOpen) {
            onOpen();
        } else if (visible && onClose) {
            onClose();
        }
        if (!isControlled) {
            setLocalVisible(!visible);
        }
    };

    const classes =
        `cc-accordion ` +
        `${visible ? 'cc-accordion-content-visible ' : ''}` +
        `${alignIconRight ? 'cc-accordion-trigger-align-right ' : ''}` +
        `cc--accordion-${variant} ` +
        `${className ? className : ''}`;

    const contextConfig = {
        visible,
        toggleAccordion,
        alignIconRight,
        useChevronIcon,
    };

    return (
        <AccordionProvider value={contextConfig}>
            <div className={classes} {...other}>
                {children}
            </div>
        </AccordionProvider>
    );
};

export default Accordion;
