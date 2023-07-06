import { capitalize } from 'lodash';
import { generateMatchPdf } from '../../../pdfs/matchPdf';
// Components
import { actionIcDateRange, actionIcExitToApp, actionIcHome, actionIcLaunch, actionIcPrint } from '../../../assets/icons';
import Icon from '../../../commonComponents/Icon';
import IconButton from '../../../commonComponents/IconButton';
// Styling
import './MatchCard.scss';

const MatchCard = (props) => {
    const { group, match, goToMatchDetails, getScore, category } = props;

    return (
        <div className="match-card">
            <div className="date-logo">
                <IconButton>
                    <Icon src={actionIcDateRange} />
                </IconButton>
            </div>
            <div className="print-logo">
                <IconButton onClick={() => generateMatchPdf(match, group, category)}>
                    <Icon src={actionIcPrint} />
                </IconButton>
            </div>
            <div className="details-logo">
                <IconButton onClick={() => goToMatchDetails({ ...match, groupName: group.name })}>
                    <Icon src={actionIcLaunch} />
                </IconButton>
            </div>
            <div className="home-team">
                <Icon src={actionIcHome} />
                <span>{capitalize(match.teams[0].name)}</span>
            </div>
            <div className="away-team">
                <Icon src={actionIcExitToApp} />
                <span>{capitalize(match.teams[1].name)}</span>
            </div>
            <div className="results">{getScore(match)}</div>
        </div>
    );
};

export default MatchCard;
