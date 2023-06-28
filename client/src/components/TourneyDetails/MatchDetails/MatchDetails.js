import { capitalize } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
// Components
import { contentIcAddCircle, contentIcShield } from '../../../assets/icons';
import Button from '../../../commonComponents/Button';
import FormField from '../../../commonComponents/FormField';
import Icon from '../../../commonComponents/Icon';
import IconButton from '../../../commonComponents/IconButton';
import Input from '../../../commonComponents/Input';
import Label from '../../../commonComponents/Label';
import { Modal, ModalBody, ModalFooter } from '../../../commonComponents/Modal';
import { ProgressIndicator, ProgressIndicatorStep } from '../../../commonComponents/ProgressIndicator';
import { Option, Select } from '../../../commonComponents/Select';
import DeleteConfirmation from '../../DeleteConfirmation';
// Assets
import goalIcon from '../../../assets/goal-icon.png';
import redCardIcon from '../../../assets/red-card-icon.png';
import yellowCardIcon from '../../../assets/yellow-card-icon.png';
// Styling
import './MatchDetails.scss';

const MatchDetails = (props) => {
    const { match, setMatchDetails, getScore } = props;

    const [detailsForm, setDetailsForm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = (item) => {};

    const getImage = (type) => {
        switch (type) {
            case 'gol':
                return goalIcon;
            case 'tarjeta amarilla':
                return yellowCardIcon;
            case 'tarjeta roja':
                return redCardIcon;
            default:
                return null;
        }
    };

    return (
        <div className="match-details">
            <div className="match-details-header">
                <div className="match-details-home-team">
                    <Icon src={contentIcShield} />
                    <h3>{capitalize(match.teams[0].name)}</h3>
                </div>
                <h4>{getScore(match)}</h4>
                <div className="match-details-away-team">
                    <Icon src={contentIcShield} />
                    <h3>{capitalize(match.teams[1].name)}</h3>
                </div>
            </div>
            <div className="match-details-list">
                <div className="home-det">Jugador</div>
                <div className="time-det">Minuto</div>
                <div className="away-det">Jugador</div>
                {match.details
                    .sort((a, b) => a.time_in_match - b.time_in_match)
                    .map((det, index) => {
                        const side = match.teams[0].players.some((x) => x._id === det.player._id);
                        return (
                            <Fragment key={det.player?.name + index}>
                                <div className={side ? 'home-det' : 'away-det'} style={{ gridRow: index + 2 }}>
                                    {side && <img src={getImage(det.type)} alt="type-img" />}
                                    {capitalize(det.player?.name)}
                                    {!side && <img src={getImage(det.type)} alt="type-img" />}
                                </div>
                                <div className="time-det" style={{ gridRow: index + 2 }}>
                                    {det.time_in_match}'
                                </div>
                            </Fragment>
                        );
                    })}
            </div>
            <IconButton className="match-details-add-detail add-new" onClick={() => setDetailsForm(true)}>
                <Icon src={contentIcAddCircle} />
            </IconButton>
            <DetailModal show={detailsForm} match={match} onClose={() => setDetailsForm(false)} setMatchDetails={setMatchDetails} />
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete} message={'¿Seguro quieres eliminar este registro?'} />
        </div>
    );
};

const DetailModal = (props) => {
    const { show, match, onClose, setMatchDetails } = props;

    const [tabIndex, setTabIndex] = useState(0);
    const [type, setType] = useState();
    const [team, setTeam] = useState();
    const [player, setPlayer] = useState('');
    const [time_in_match, setTime] = useState();

    const handleSubmit = () => {
        setMatchDetails({
            ...match,
            details: match.details.concat({
                type,
                player: team.players.find((x) => x._id === player),
                time_in_match: Number(time_in_match),
            }),
        });
        onClose();
    };

    useEffect(() => {
        type ? setTabIndex(1) : setTabIndex(0);
    }, [type]);

    useEffect(() => {
        setPlayer(undefined);
        setTime();
    }, [team]);

    useEffect(() => {
        player === undefined && setPlayer('');
    }, [player]);

    useEffect(() => {
        if (!show) {
            setTabIndex(0);
            setType();
            setTeam();
            setPlayer('');
            setTime();
        }
    }, [show]);

    return (
        <Modal show={show} onClose={onClose}>
            <ModalBody>
                <ProgressIndicator>
                    <ProgressIndicatorStep
                        body={'Tipo'}
                        status={tabIndex === 0 ? 'active' : type ? 'completed' : 'default'}
                        onClick={() => {
                            setType();
                            setTeam();
                            setPlayer();
                            setTime();
                        }}
                    />
                    <ProgressIndicatorStep body={'Jugador'} status={tabIndex === 1 ? 'active' : 'default'} />
                </ProgressIndicator>
                <div className="match-details-modal-body">
                    {tabIndex === 0 && (
                        <div className="match-details-modal-body-type">
                            <div onClick={() => setType('gol')}>
                                <img src={goalIcon} alt="goal-icon" />
                                <figcaption>Gol</figcaption>
                            </div>
                            <div onClick={() => setType('tarjeta amarilla')}>
                                <img src={yellowCardIcon} alt="goal-icon" />
                                <figcaption>Tarjeta Amarilla</figcaption>
                            </div>
                            <div onClick={() => setType('tarjeta roja')}>
                                <img src={redCardIcon} alt="goal-icon" />
                                <figcaption>Tarjeta Roja</figcaption>
                            </div>
                        </div>
                    )}
                    {tabIndex === 1 && (
                        <>
                            <div className="match-details-modal-body-team">
                                <div className={`match-details-home-team${team && team?.name !== match.teams[0].name ? ' disabled' : ''}`} onClick={() => setTeam(match.teams[0])}>
                                    <Icon src={contentIcShield} />
                                    <h3>{capitalize(match.teams[0].name)}</h3>
                                </div>
                                <div className={`match-details-away-team${team && team?.name !== match.teams[1].name ? ' disabled' : ''}`} onClick={() => setTeam(match.teams[1])}>
                                    <Icon src={contentIcShield} />
                                    <h3>{capitalize(match.teams[1].name)}</h3>
                                </div>
                            </div>
                            {team && (
                                <div className="match-details-modal-body-info">
                                    {player !== undefined && (
                                        <FormField>
                                            <Label>Jugador</Label>
                                            <Select value={player} onChange={(e) => setPlayer(e)}>
                                                {team.players.map((option, index) => (
                                                    <Option value={option._id} key={option._id + index}>
                                                        {capitalize(option.name)}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormField>
                                    )}
                                    <FormField>
                                        <Label>Minuto</Label>
                                        <Input type="number" min={0} max={200} value={time_in_match} onChange={(e) => setTime(e.target.value)} />
                                    </FormField>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </ModalBody>
            <ModalFooter className="match-details-modal-footer">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                {type && team && player && time_in_match && (
                    <Button type="button" variant="primery" onClick={handleSubmit}>
                        Confirmar
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default MatchDetails;
