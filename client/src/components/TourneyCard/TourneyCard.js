import { capitalize } from 'lodash';
// Components
import { Card, CardHeader, CardBody } from '../../commonComponents/Card';
import { Pill } from '../../commonComponents/Pill'
// Assets
// Styling
import './TourneyCard.scss';
import Icon from '../../commonComponents/Icon';
import { contentIcKnockoutStage, editorIcFormatListNumbered, editorIcBorderAll, contentIcAdd } from '../../assets/icons';

const TourneyCard = (props) => {
    const { tourney: { name, status, type } } = props;

    const getStatusVariant = () => {
        if('Nuevo') return 'info';
        if('Jugando') return 'success';
        return 'warning'
    }

    const getIcons = () => {
        const icons = []
        if(type.includes('Liga')) icons.push(editorIcFormatListNumbered)
        if(type.includes('Grupos')) icons.push(editorIcBorderAll)
        if(type.includes('+')) icons.push(contentIcAdd)
        if(type.includes('Eliminatoria')) icons.push(contentIcKnockoutStage)
        return icons
    }

    return (
        <Card className='tourney-card'>
            <CardHeader className='tourney-card-header'>
                <h2>{capitalize(name)}</h2>
                <Pill variant={getStatusVariant()}>{capitalize(status)}</Pill>
            </CardHeader>
            <CardBody className='tourney-card-body'>
                <p><strong>Formato: </strong>{type}</p>
                <div>{
                    getIcons().map((x,index) => <Icon key={index} src={x}/>)
                }</div>
            </CardBody>
        </Card>
    )
}

export default TourneyCard;