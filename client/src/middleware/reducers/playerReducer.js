import { sortBy } from 'lodash';
import {
    PLAYER_GET_PLAYER_LIST,
    PLAYER_POST_NEW_PLAYER,
    PLAYER_DELETE_NEW_PLAYER,
    PLAYER_PUT_PLAYER,
} from '../constants/player';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };

const initialState = {
    playerList: { ...initial },
    crud: { ...initial },
};

export const playerReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // GET PLAYER LIST
        case getRequest(PLAYER_GET_PLAYER_LIST): {
            return {
                ...state,
                playerList: { loading: true, data: [], error: null },
            };
        }
        case getSuccess(PLAYER_GET_PLAYER_LIST): {
            return {
                ...state,
                playerList: { loading: false, data: sortBy(payload, ['name']), error: null },
            };
        }
        case getFailure(PLAYER_GET_PLAYER_LIST): {
            return {
                ...state,
                playerList: { loading: false, data: null, error: payload },
            };
        }
        // POST PLAYER
        case getRequest(PLAYER_POST_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(PLAYER_POST_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(PLAYER_POST_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        // PUT PLAYER
        case getRequest(PLAYER_PUT_PLAYER): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(PLAYER_PUT_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(PLAYER_PUT_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        // DELETE PLAYER
        case getRequest(PLAYER_DELETE_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(PLAYER_DELETE_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(PLAYER_DELETE_NEW_PLAYER): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        default:
            return state;
    }
};
