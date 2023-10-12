import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
// Components
import { contentIcAddCircle, contentIcSave, contentIcShield } from '../../../assets/icons';
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
import goalIcon from '../../../assets/goal-icon.webp';
import noGoalIcon from '../../../assets/no-goal.webp';
import redCardIcon from '../../../assets/red-card-icon.webp';
import yellowCardIcon from '../../../assets/yellow-card-icon.webp';
// MiddleWare
// Styling
import './MatchDetails.scss';

const MatchDetails = (props) => {
    const { match, setMatchDetails, getScore, isKnockout } = props;

    const [detailsForm, setDetailsForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detailsList, setDetailsList] = useState([...match?.details]);
    const [indexDel, setIndex] = useState();

    const handleDelete = () => {
        setDetailsList(detailsList.filter((_, i) => i !== indexDel));
        setShowModal(false);
        setIndex();
    };

    const handleSubmit = () => {
        setMatchDetails({
            ...match,
            details: detailsList,
        });
    };

    useEffect(() => {
        const footer = document.querySelector('.tourney-details-footer');
        footer.style.visibility = 'hidden';
        return () => (footer.style.visibility = 'visible');
    }, []);

    const getImage = (type) => {
        switch (type) {
            case 'gol':
                return goalIcon;
            case 'sin goles':
                return noGoalIcon;
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
                <div className="match-details-list-header">
                    <h4>Jugador</h4>
                    <h4></h4>
                    <h4>Jugador</h4>
                </div>
                {detailsList.map((det, index) => {
                    const side = match.teams[0].players.some((x) => x._id === det?.player?._id);
                    return (
                        <div
                            key={det.player?.name + index}
                            className="match-details-list-item"
                            onClick={() => {
                                setIndex(index);
                                setShowModal(true);
                            }}
                        >
                            {det.type === 'sin goles' ? (
                                <>
                                    <div className="home-det" style={{ gridRow: index + 2 }}>
                                        --------------------
                                    </div>
                                    <div className="time-det" style={{ gridRow: index + 2 }}>
                                        <img src={getImage(det.type)} alt="type-img" />
                                    </div>
                                    <div className="away-det" style={{ gridRow: index + 2 }}>
                                        --------------------
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={side ? 'home-det' : 'away-det'} style={{ gridRow: index + 2 }}>
                                        {side && <img src={getImage(det.type)} alt="type-img" />}
                                        {capitalize(det.player?.name)}
                                        {!side && <img src={getImage(det.type)} alt="type-img" />}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {!match.disabled && (
                <>
                    <IconButton className="match-details-icon-add add-new" onClick={() => setDetailsForm(true)}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                    <IconButton className="match-details-icon-save add-new" onClick={handleSubmit}>
                        <Icon src={contentIcSave} />
                    </IconButton>
                </>
            )}
            <DetailModal show={detailsForm} match={match} onClose={() => setDetailsForm(false)} detailsList={detailsList} setDetailsList={setDetailsList} isKnockout={isKnockout} />
            <DeleteConfirmation show={showModal} onClose={() => setShowModal(false)} onSubmit={handleDelete} message={'¿Seguro quieres eliminar este registro?'} />
        </div>
    );
};

const DetailModal = (props) => {
    const { show, match, onClose, setDetailsList, detailsList, isKnockout } = props;

    const [tabIndex, setTabIndex] = useState(0);
    const [type, setType] = useState();
    const [team, setTeam] = useState();
    const [player, setPlayer] = useState('');
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        if (!type) setTabIndex(0);
        else type === 'sin goles' ? handleSubmit() : setTabIndex(1);
        setCantidad(1);
    }, [type]);

    useEffect(() => {
        setPlayer(undefined);
        setCantidad(1);
    }, [team]);

    useEffect(() => {
        player === undefined && setPlayer('');
        setCantidad(1);
    }, [player]);

    useEffect(() => {
        if (!show) {
            setTabIndex(0);
            setType();
            setTeam();
            setPlayer('');
            setCantidad(1);
        }
    }, [show]);

    const handleSubmit = () => {
        const newList = [...detailsList];
        for (let i = 0; i < cantidad; i++) {
            newList.push({
                type,
                player: type !== 'sin goles' ? team.players.find((x) => x._id === player) : null,
            });
        }
        setDetailsList(newList);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} className="match-details-modal">
            <ModalBody>
                <ProgressIndicator>
                    <ProgressIndicatorStep
                        body={`Tipo${type ? ': ' + capitalize(type) : ''}`}
                        status={tabIndex === 0 ? 'active' : type ? 'completed' : 'default'}
                        onClick={() => {
                            setType();
                            setTeam();
                            setPlayer();
                            setCantidad(0);
                        }}
                    />
                    <ProgressIndicatorStep body={'Jugador'} status={tabIndex === 1 ? 'active' : 'default'} />
                </ProgressIndicator>
                <div className="match-details-modal-body">
                    {tabIndex === 0 && (
                        <div className="match-details-modal-body-type">
                            <div className={detailsList.some((x) => x.type === 'sin goles') ? 'match-details-modal-body-type__disabled' : ''}>
                                <img src={goalIcon} alt="goal-icon" onClick={() => setType('gol')} />
                                <figcaption>Gol</figcaption>
                            </div>
                            {!isKnockout && (
                                <div className={detailsList.some((x) => x.type === 'gol' || x.type === 'sin goles') ? 'match-details-modal-body-type__disabled' : ''}>
                                    <img src={noGoalIcon} alt="sin-goles" onClick={() => setType('sin goles')} />
                                    <figcaption>Sin goles</figcaption>
                                </div>
                            )}
                            <div>
                                <img src={yellowCardIcon} alt="tarjeta-amarilla" onClick={() => setType('tarjeta amarilla')} />
                                <figcaption>Tarjeta Amarilla</figcaption>
                            </div>
                            <div>
                                <img src={redCardIcon} alt="tarjeta-roja" onClick={() => setType('tarjeta roja')} />
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
                                                {team.players
                                                    .filter((x) => x.sanction === 0)
                                                    .map((option, index) => (
                                                        <Option value={option._id} key={option._id + index}>
                                                            {capitalize(option.name)}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </FormField>
                                    )}
                                    {(type === 'gol' || type === 'tarjeta amarilla') && (
                                        <FormField>
                                            <Label>Cantidad</Label>
                                            <Input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                        </FormField>
                                    )}
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
                {type && team && player && cantidad && cantidad > 0 && (
                    <Button type="button" variant="primery" onClick={handleSubmit}>
                        Confirmar
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
};

export default MatchDetails;
