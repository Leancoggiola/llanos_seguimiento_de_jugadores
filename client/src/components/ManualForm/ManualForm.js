import { useEffect, useState } from 'react';
import { capitalize } from 'lodash';
// Components
import Button from '../../commonComponents/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../commonComponents/Modal';
import FormField from '../../commonComponents/FormField';
import Label from '../../commonComponents/Label';
import { Option, Select } from '../../commonComponents/Select';
// Styling
import './ManualForm.scss';

const ManualForm = (props) => {
    const { show, onClose, onSubmit, groupsTotal, teams } = props;

    const [groups, setGroups] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [totalPerGrous, setTotal] = useState(0);

    useEffect(() => {
        if (show) {
            setSelectedTeams([]);
            setGroups(
                [...Array(Number(groupsTotal))].map((_, i) => ({
                    name: `Grupo ${String.fromCharCode(65 + i)}`,
                    teams: [],
                    matchs: [],
                    table: [],
                }))
            );
            setTotal(Math.round(teams.length / Number(groupsTotal)));
        }
    }, [show]);

    const handleChange = (e, index) => {
        groups[index].teams = teams.filter((x) => e.includes(x._id));
        setGroups([...groups]);
        setSelectedTeams(groups.flatMap((x) => x.teams.map((y) => y._id)));
    };

    const getGroupTeams = (teams) => teams.map((x) => x._id);

    const validate = () => {
        let valid = true;
        // Every team was selected
        valid = valid && teams.every((x) => selectedTeams.includes(x._id));
        // Every group have teams and Max of total per group
        valid = valid && groups.every((x) => x.teams.length && x.teams.length <= totalPerGrous);

        return valid;
    };

    return (
        <Modal show={show} onClose={onClose} className="manual-group-modal">
            <ModalHeader>Configurar grupos</ModalHeader>
            <ModalBody>
                {groups?.map((group, i) => (
                    <div className="manual-group-modal-team" key={'group-' + i}>
                        <h2>{group.name}</h2>
                        <h4>Equipos: ({group.teams.length})</h4>
                        <span>{group.teams.map((x) => `${capitalize(x.name)}, `)}</span>
                        <FormField>
                            <Label>Añadir</Label>
                            <Select value={getGroupTeams(group.teams)} onChange={(e) => handleChange(e, i)} filter={true} multiple={true}>
                                {teams
                                    .filter((x) => {
                                        return group.teams.some((t) => t._id === x._id) ? true : !selectedTeams.includes(x._id);
                                    })
                                    .map((option, index) => (
                                        <Option value={option._id} key={option._id + index}>
                                            {capitalize(option.name)}
                                        </Option>
                                    ))}
                            </Select>
                        </FormField>
                    </div>
                ))}
            </ModalBody>
            <ModalFooter className="manual-group-modal-footer">
                <Button type="button" variant="secondary" onClick={() => onClose()}>
                    Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={() => onSubmit(groups)} disabled={!validate()}>
                    Confirmar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ManualForm;
