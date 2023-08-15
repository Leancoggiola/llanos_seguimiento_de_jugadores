import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircle } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import FormField from '../../commonComponents/FormField';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import Input from '../../commonComponents/Input';
import Label from '../../commonComponents/Label';
import PlayerCard from '../../components/PlayerCard';
import PlayerForm from '../../components/PlayerForm';
// Middleware
import { navbarBack, navbarNewEntry } from '../../middleware/actions/navbarActions';
// Styling
import './Players.scss';

const Players = () => {
    const playerList = useSelector((state) => state.player.playerList);
    const [playerForm, setPlayerForm] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [textFilter, setTextFilter] = useState('');

    const dispatch = useDispatch();

    const handleABMPlayer = () => {
        setPlayerForm(true);
        dispatch(navbarNewEntry({ action: setPlayerForm, param: false }));
    };

    useEffect(() => {
        !playerForm && setSelectedPlayer(null);
    }, [playerForm]);

    useEffect(() => {
        selectedPlayer && handleABMPlayer();
    }, [selectedPlayer]);

    if (playerList.error) return <ErrorMessage message={playerList.error.message} />;

    const applyFilter = (data) => {
        if (textFilter) {
            return data.filter((x) => x.name.toLowerCase().includes(textFilter.toLowerCase()));
        }
        return data;
    };

    return (
        <section className="player-page-container">
            {playerForm && <PlayerForm onClose={() => dispatch(navbarBack())} player={selectedPlayer} />}
            {!playerForm && (
                <>
                    <FormField>
                        <Label>Nombre...</Label>
                        <Input type="text" value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
                    </FormField>
                    {!isEmpty(playerList.data) &&
                        applyFilter(playerList.data).map((player, index) => <PlayerCard key={player.name + index} player={player} setSelectedPlayer={setSelectedPlayer} />)}
                    <IconButton className="add-new" onClick={handleABMPlayer}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Players;
