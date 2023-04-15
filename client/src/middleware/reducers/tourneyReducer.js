import { TOURNEY_GET_TOURNEY_LIST, TOURNEY_POST_NEW_TOURNEY } from '../constants/tourney';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };

const initialState = {
    tourneyList: {...initial},
    crud: {...initial}
}

export const tourneyReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET TOURNEY LIST
        case getRequest(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: true, data: [], error: null }
            }
        }
        case getSuccess(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: false, data: [...state.tourneyList.data, ...payload], error: null }
            }
        }
        case getFailure(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: false, data: null, error: payload }
            }
        }
        // POST TOURNEY
        case getRequest(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload }
            }
        }
        default: return state;
    }
}