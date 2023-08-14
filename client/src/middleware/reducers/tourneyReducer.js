import {
    TOURNEY_GET_TOURNEY_LIST,
    TOURNEY_POST_NEW_TOURNEY,
    TOURNEY_DELETE_NEW_TOURNEY,
    TOURNEY_PUT_TOURNEY,
    TOURNEY_GET_TOURNEY_DETAILS,
    TOURNEY_PUT_TOURNEY_DETAILS,
    TOURNEY_RESET_TOURNEY_DETAILS,
} from '../constants/tourney';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };
const STATUS_ENUM = ['Jugando', 'Nuevo', 'Terminado'];

const initialState = {
    tourneyList: { ...initial },
    crud: { ...initial },
    tourneyDetails: { ...initial },
};

export const tourneyReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // GET TOURNEY LIST
        case getRequest(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: true, data: [], error: null },
            };
        }
        case getSuccess(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: {
                    loading: false,
                    data: payload.sort((a, b) => STATUS_ENUM.indexOf(a.status) - STATUS_ENUM.indexOf(b.status)),
                    error: null,
                },
            };
        }
        case getFailure(TOURNEY_GET_TOURNEY_LIST): {
            return {
                ...state,
                tourneyList: { loading: false, data: null, error: payload },
            };
        }
        // GET TOURNEY DETAILS
        case getRequest(TOURNEY_GET_TOURNEY_DETAILS): {
            return {
                ...state,
                tourneyDetails: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(TOURNEY_GET_TOURNEY_DETAILS): {
            const index = state.tourneyList.data.findIndex((x) => x._id === payload._id);
            const newData = [...state.tourneyList.data];
            newData[index] = { ...payload };
            return {
                ...state,
                tourneyList: {
                    loading: false,
                    data: newData.sort((a, b) => STATUS_ENUM.indexOf(a.status) - STATUS_ENUM.indexOf(b.status)),
                    error: null,
                },
                tourneyDetails: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(TOURNEY_GET_TOURNEY_DETAILS): {
            return {
                ...state,
                tourneyDetails: { loading: false, data: null, error: payload },
            };
        }
        case TOURNEY_RESET_TOURNEY_DETAILS: {
            return {
                ...state,
                tourneyDetails: { ...initial },
            };
        }
        // POST TOURNEY
        case getRequest(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(TOURNEY_POST_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        // PUT TOURNEY
        case getRequest(TOURNEY_PUT_TOURNEY): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(TOURNEY_PUT_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(TOURNEY_PUT_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        // PUT TOURNEY DETAILS
        case getRequest(TOURNEY_PUT_TOURNEY_DETAILS): {
            return {
                ...state,
                tourneyDetails: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(TOURNEY_PUT_TOURNEY_DETAILS): {
            return { ...state };
        }
        case getFailure(TOURNEY_PUT_TOURNEY_DETAILS): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        // Delete TOURNEY
        case getRequest(TOURNEY_DELETE_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null },
            };
        }
        case getSuccess(TOURNEY_DELETE_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: payload, error: null },
            };
        }
        case getFailure(TOURNEY_DELETE_NEW_TOURNEY): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload },
            };
        }
        default:
            return state;
    }
};
