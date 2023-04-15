// Componentes
import { contentIcRemove } from '../../assets/icons';
import Icon from '../Icon';
import IconButton from '../IconButton';
// Styling
import './List.scss'

const List = (props) => {
    const { items, type='ul', className, removeBtn, onRemove = () => null } = props;
    const classes = `cc-list ${className ? className : ''}`;

    const isRemovable = (item) => {
        return typeof removeBtn === 'function' ? removeBtn(item) : removeBtn
    }
    
    if(type === 'ul') {
        return(
            <ul className={classes}>
                {items.map((item, index) => (
                    <li key={item+index}>
                        {item}
                        {isRemovable(item) && 
                        <IconButton onClick={() => onRemove(item)}>
                            <Icon src={contentIcRemove}/>
                        </IconButton>}
                    </li>))}
            </ul>
        )
    }
    if(type === 'ol') {
        return(
            <ol className={classes}>
                {items.map((item, index) => (
                    <li key={item+index}>
                        {index+1} - {item}
                        {isRemovable(item) && 
                        <IconButton onClick={() => onRemove(item)}>
                            <Icon src={contentIcRemove}/>
                        </IconButton>}
                    </li>))}
            </ol>
        )
    }
    return null;
}

export default List;