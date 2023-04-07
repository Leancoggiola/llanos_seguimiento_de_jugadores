import { TOURNEY_GET_TOURNEY_LIST } from '../constants/tourney';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };

const initialState = {
    tourneyList: {...initial}
}

export const tourneyReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET TOURNEY LIST
        case getRequest(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: false, data: null, error: payload }
            }
        }
        default: return state;
    }
}