import { capitalize, isEmpty } from 'lodash';
// Components
import {
    actionIcDateRange,
    actionIcExitToApp,
    actionIcHome,
    actionIcLaunch,
    actionIcPrint,
} from '../../../assets/icons';
import Icon from '../../../commonComponents/Icon';
import IconButton from '../../../commonComponents/IconButton';
// Styling
import './MatchCard.scss';

const MatchCard = (props) => {
    const {
        match: { teams, details },
    } = props;

    return (
        <div class="match-card">
            <div class="date-logo">
                <IconButton>
                    <Icon src={actionIcDateRange} />
                </IconButton>
            </div>
            <div class="print-logo">
                <IconButton>
                    <Icon src={actionIcPrint} />
                </IconButton>
            </div>
            <div class="details-logo">
                <IconButton>
                    <Icon src={actionIcLaunch} />
                </IconButton>
            </div>
            <div class="home-team">
                <Icon src={actionIcHome} />
                <span>{capitalize(teams[0].name)}</span>
            </div>
            <div class="away-team">
                <Icon src={actionIcExitToApp} />
                <span>{capitalize(teams[1].name)}</span>
            </div>
            <div class="results">{isEmpty(details) ? 'Sin resultados' : null}</div>
        </div>
    );
};

export default MatchCard;
