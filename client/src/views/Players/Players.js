import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { contentIcAddCircleOutline } from '../../assets/icons';
import ErrorMessage from '../../commonComponents/ErrorMessage';
import Icon from '../../commonComponents/Icon';
import IconButton from '../../commonComponents/IconButton';
import PlayerForm from '../../components/PlayerForm';
import PlayerCard from '../../components/PlayerCard';
// Middleware
import { navbarNewEntry, navbarBack } from '../../middleware/actions/navbarActions';
// Styling
import './Players.scss';

const Players = () => {
    const playerList = useSelector((state) => state.player.playerList);
    const [playerForm, setPlayerForm] = useState(false);

    const dispatch = useDispatch();

    const handleNewPlayer = () => {
        dispatch(navbarNewEntry({ action: setPlayerForm, param: false }));
        setPlayerForm(true);
    };

    if (playerList.error) return <ErrorMessage message={playerList.error.message} />;

    return (
        <section className="player-page-container">
            {playerForm && <PlayerForm onClose={() => dispatch(navbarBack())} />}
            {!playerForm && (
                <>
                    {!isEmpty(playerList.data) &&
                        playerList.data.map((player, index) => (
                            <PlayerCard key={player.name + index} player={player} />
                        ))}
                    <IconButton className="add-new" onClick={handleNewPlayer}>
                        <Icon src={contentIcAddCircleOutline} />
                    </IconButton>
                </>
            )}
        </section>
    );
};

export default Players;
