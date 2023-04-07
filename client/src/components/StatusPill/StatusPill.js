import { Pill } from '../../commonComponents/Pill';
// Styling
import './StatusPill.scss'

const StatusPill = ({ status, className }) => {
    const classes = `status-pill-${status?.toLowerCase()} ${className ? className : ''}`
    return (
        <Pill className={classes}>{status}</Pill>
    )
}

export default StatusPill;