import { TEAM_GET_TEAM_LIST, TEAM_POST_NEW_TEAM } from '../constants/team';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };

const initialState = {
    teamList: {...initial},
    crud: {...initial}
}

export const teamReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET TEAM LIST
        case getRequest(TEAM_GET_TEAM_LIST): {
            return {
                ...state,
                teamList: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(TEAM_GET_TEAM_LIST): {
            return {
                ...state,
                teamList: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(TEAM_GET_TEAM_LIST): {
            return {
                ...state,
                teamList: { loading: false, data: null, error: payload }
            }
        }
        // POST TEAM
        case getRequest(TEAM_POST_NEW_TEAM): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(TEAM_POST_NEW_TEAM): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(TEAM_POST_NEW_TEAM): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload }
            }
        }
        default: return state;
    }
}