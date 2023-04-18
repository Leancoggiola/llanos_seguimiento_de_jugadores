import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { navbarReducer } from './navbarReducer';
import { playerReducer } from './playerReducer';
import { teamReducer } from './teamReducer';
import { tourneyReducer } from './tourneyReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    navbar: navbarReducer,
    player: playerReducer,
    team: teamReducer,
    tourney: tourneyReducer
})

export default rootReducer;