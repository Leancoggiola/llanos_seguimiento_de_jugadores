// Styling
import './List.scss'

const List = (props) => {
    const { items, type='ul', className, title } = props;
    const classes = `cc-list ${className ? className : ''}`;
    
    if(type === 'ul') {
        return(
            <ul className={classes}>
                {items.map((item, index) => (<li key={item+index}>{item}</li>))}
            </ul>
        )
    }
    if(type === 'ol') {
        return(
            <ol className={classes}>
                {items.map((item, index) => (<li key={item+index}>{index+1} - {item}</li>))}
            </ol>
        )
    }
    return null;
}

export default List;