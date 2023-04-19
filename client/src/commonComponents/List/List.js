import { capitalize } from 'lodash';
// Styling
import './List.scss';

const List = (props) => {
    const { children, type = 'ul', className } = props;
    const classes = `cc-list ${className ? className : ''}`;

    if (type === 'ul') {
        return (
            <ul className={classes}>
                {children.map((item, index) => (
                    <li key={item + index}>{typeof item === 'string' ? capitalize(item) : item}</li>
                ))}
            </ul>
        );
    }
    if (type === 'ol') {
        return (
            <ol className={classes}>
                {children.map((item, index) => (
                    <li key={item + index}>
                        {index + 1} - {item}
                    </li>
                ))}
            </ol>
        );
    }
    return null;
};

export default List;
