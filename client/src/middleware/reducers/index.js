import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { listReducer } from './listReducer';
import { tourneyReducer } from './tourneyReducer';
import { searchReducer } from './searchReducer';

const rootReducer = combineReducers({
    list: listReducer,
    tourney: tourneyReducer,
    auth: authReducer,
    search: searchReducer
})

export default rootReducer;