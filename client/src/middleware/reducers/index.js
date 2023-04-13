import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { navbarReducer } from './navbarReducer';
import { tourneyReducer } from './tourneyReducer';
import { teamReducer } from './teamReducer';

const rootReducer = combineReducers({
    navbar: navbarReducer,
    tourney: tourneyReducer,
    auth: authReducer,
    team: teamReducer
})

export default rootReducer;