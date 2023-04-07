import { CHANGE_LIST_TO_DISPLAY, DELETE_ITEM_FROM_LIST, GET_USER_LIST, POST_ITEM_TO_LIST, PUT_CHANGE_ITEM_ON_LIST } from '../constants/list';
import { getFailure, getRequest, getSuccess } from '../index.js';

const initial = { loading: false, data: null, error: null };

const initialState = {
    userList: {...initial},
    crud: {...initial},
    display: 'all'
}

export const listReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET User List
        case getRequest(GET_USER_LIST): {
            return {
                ...state,
                userList: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(GET_USER_LIST): {
            return {
                ...state,
                userList: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(GET_USER_LIST): {
            return {
                ...state,
                userList: { loading: false, data: null, error: payload }
            }
        }
        // Post Item to List
        case getRequest(POST_ITEM_TO_LIST): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(POST_ITEM_TO_LIST): {
            return {
                ...state,
                crud: { loading: false, data: payload.message, error: null },
                userList: { loading: false, data: payload.newList, error: null }
            }
        }
        case getFailure(POST_ITEM_TO_LIST): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload }
            }
        }
        // Update Item on List
        case getRequest(PUT_CHANGE_ITEM_ON_LIST): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(PUT_CHANGE_ITEM_ON_LIST): {
            return {
                ...state,
                crud: { loading: false, data: payload.message, error: null },
                userList: { loading: false, data: payload.newList, error: null }
            }
        }
        case getFailure(PUT_CHANGE_ITEM_ON_LIST): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload }
            }
        }
        // Delete Item from List
        case getRequest(DELETE_ITEM_FROM_LIST): {
            return {
                ...state,
                crud: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(DELETE_ITEM_FROM_LIST): {
            return {
                ...state,
                crud: { loading: false, data: payload.message, error: null },
                userList: { loading: false, data: payload.newList, error: null }
            }
        }
        case getFailure(DELETE_ITEM_FROM_LIST): {
            return {
                ...state,
                crud: { loading: false, data: null, error: payload }
            }
        }
        case CHANGE_LIST_TO_DISPLAY: {
            return {
                ...state,
                display: payload ? payload : 'all'
            }
        }
        default: return state;
    }
}