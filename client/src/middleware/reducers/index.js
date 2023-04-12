import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { navbarReducer } from './navbarReducer';
import { tourneyReducer } from './tourneyReducer';
import { searchReducer } from './searchReducer';

const rootReducer = combineReducers({
    navbar: navbarReducer,
    tourney: tourneyReducer,
    auth: authReducer,
    search: searchReducer
})

export default rootReducer;