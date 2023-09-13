import { useEffect, useState } from 'react';
import { capitalize } from 'lodash';
// Components
import Button from '../../commonComponents/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../commonComponents/Modal';
import FormField from '../../commonComponents/FormField';
import Label from '../../commonComponents/Label';
import { Option, Select } from '../../commonComponents/Select';
// Styling
import './ManualTeamSelection.scss';

const ManualTeamSelection = (props) => {
    const {
        show,
        onClose,
        onSubmit,
        configTeamsModal: { groupId, teams },
    } = props;

    const [newTeams, setTeams] = useState([
        { _id: null, name: null },
        { _id: null, name: null },
    ]);

    useEffect(() => {
        setTeams([
            { _id: null, name: null },
            { _id: null, name: null },
        ]);
    }, [show]);

    const handleChange = (e, i) => {
        if (e !== '') {
            const team = teams.find((x) => x._id === e);
            newTeams[i] = team;
        } else {
            newTeams[i] = { _id: null, name: null };
        }
        setTeams([...newTeams]);
    };

    const getTeam = (index) => newTeams[index]._id;

    const validate = () => newTeams.every((x) => x._id !== null);

    return (
        <Modal show={show && groupId !== null} onClose={onClose} className="manual-teams-modal">
            <ModalHeader>Configurar partido</ModalHeader>
            <ModalBody>
                <div className="manual-teams-modal-team" key={'group-'}>
                    <FormField>
                        <Label>Local</Label>
                        <Select value={getTeam(0)} onChange={(e) => handleChange(e, 0)} filter={true}>
                            {teams
                                .filter((x) => x._id !== newTeams[1]._id)
                                .map((option, index) => (
                                    <Option value={option._id} key={option._id + index}>
                                        {capitalize(option.name)}
                                    </Option>
                                ))}
                        </Select>
                    </FormField>
                    <FormField>
                        <Label>Visitante</Label>
                        <Select value={getTeam(0)} onChange={(e) => handleChange(e, 1)} filter={true}>
                            {teams
                                .filter((x) => x._id !== newTeams[0]._id)
                                .map((option, index) => (
                                    <Option value={option._id} key={option._id + index}>
                                        {capitalize(option.name)}
                                    </Option>
                                ))}
                        </Select>
                    </FormField>
                </div>
            </ModalBody>
            <ModalFooter className="manual-teams-modal-footer">
                <Button type="button" variant="secondary" onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={() => onSubmit(newTeams)} disabled={!validate()}>
                    Confirmar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ManualTeamSelection;
