import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
// Components
import { actionIcExitToApp, actionIcHome, actionIcLaunch, actionIcPrint, navigationIcClose } from '../../../assets/icons';
import DatePicker from '../../../commonComponents/DatePicker';
import FormField from '../../../commonComponents/FormField';
import Icon from '../../../commonComponents/Icon';
import IconButton from '../../../commonComponents/IconButton';
// Styling
import './MatchCard.scss';

const MatchCard = (props) => {
    const { group, match, goToMatchDetails, getScore, updateMatchDate, tourneyDate, disableBtn, generateMatchPdf, isFinished, configMocked } = props;

    const [date, setDate] = useState(match?.date ? new Date(match.date) : null);
    const classificated = match.teams.some((x) => x._id === '65012bf767e463f4f47fe668');
    const mocked = match.teams.some((x) => x.mocked === true);

    const handleDateChange = (e) => {
        updateMatchDate(e, match, group.name);
        setDate(e);
    };

    const handleMocked = () => {
        configMocked(match, group, mocked);
    };

    useEffect(() => {
        if (match.details) {
            setDate(getScore(match) === 'Sin resultados' ? null : date);
        } else {
            setDate(null);
        }
    }, [JSON.stringify(match.details)]);

    return (
        <div className="match-card">
            <div className="match-card-grid">
                <div className="date-logo">
                    <FormField>
                        <DatePicker
                            disabled={getScore(match) === 'Sin resultados'}
                            value={date}
                            onChange={(e) => handleDateChange(e)}
                            showLeadingZeros={false}
                            format="dd-MM-yyyy"
                            onlyIcon={true}
                            minDate={new Date(tourneyDate)}
                        />
                    </FormField>
                </div>
                <div className="print-logo">
                    <IconButton onClick={() => generateMatchPdf(match, group)} disabled={classificated || mocked}>
                        <Icon src={actionIcPrint} />
                    </IconButton>
                </div>
                <div className="details-logo">
                    <IconButton onClick={(e) => goToMatchDetails({ ...match, groupName: group.name }, e)} disabled={disableBtn || classificated || isFinished || mocked}>
                        <Icon src={actionIcLaunch} />
                    </IconButton>
                </div>
                <div className={`home-team${isFinished ? ' finished' : ''}`} onClick={() => handleMocked()}>
                    <Icon src={actionIcHome} />
                    <span>{capitalize(match.teams[0].name)}</span>
                </div>
                <div className={`away-team${isFinished ? ' finished' : ''}`} {...(classificated && { style: { color: 'var(--app-highlight)' } })}>
                    <Icon src={actionIcExitToApp} />
                    <span>{capitalize(match.teams[1].name)}</span>
                </div>
                {!classificated && <div className="results">{getScore(match)}</div>}
            </div>
            {date && (
                <div className="match-card-date">
                    <span>
                        <i>{`Jugado el: ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</i>
                    </span>
                    <IconButton onClick={() => handleDateChange(null)}>
                        <Icon src={navigationIcClose} />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default MatchCard;
