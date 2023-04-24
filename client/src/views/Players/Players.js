import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircle } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
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

    return (
        <section className="player-page-container">
            {playerForm && (
                <PlayerForm onClose={() => dispatch(navbarBack())} player={selectedPlayer} />
            )}
            {!playerForm && (
                <>
                    {!isEmpty(playerList.data) &&
                        playerList.data.map((player, index) => (
                            <PlayerCard
                                key={player.name + index}
                                player={player}
                                setSelectedPlayer={setSelectedPlayer}
                            />
                        ))}
                    <IconButton className="add-new" onClick={handleABMPlayer}>
                        <Icon src={contentIcAddCircle} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Players;
