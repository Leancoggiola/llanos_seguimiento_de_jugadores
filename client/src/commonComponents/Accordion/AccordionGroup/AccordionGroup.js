import { Children, useState, cloneElement } from 'react';

const AccordionGroup = (props) => {
    const { children } = props;
    const [activeIndex, setActiveIndex] = useState(null);

    return Children.map(children, (child, index) => {
        const open = index === activeIndex;

        return cloneElement(child, {
            onClose: () => {
                if (open) {
                    setActiveIndex(null);
                    if (child.props.onClose) {
                        child.props.onClose();
                    }
                }
            },
            onOpen: () => {
                if (!open) {
                    setActiveIndex(index);
                    if (child.props.onOpen) {
                        child.props.onOpen();
                    }
                }
            },
            open,
        });
    });
};

export default AccordionGroup;
