import { getFailure, getSuccess, getRequest} from '../index.js';
import { GET_LOGGED_USER, GET_LOGOUT_USER } from '../constants/auth';

const initialState = { loading: false, data: null, error: null }

export const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // IS USER LOGGED
        case getRequest(GET_LOGGED_USER): {
            return {...state, loading: true, data: null, error: null }
        }
        case getSuccess(GET_LOGGED_USER): {
            return {...state, loading: false, data: payload, error: null }
        }
        case getFailure(GET_LOGGED_USER): {
            return {...state, loading: false, data: null, error: payload }
        }
        // LOG OUT USER
        case getRequest(GET_LOGOUT_USER): {
            return {...state,loading: true }
        }
        case getSuccess(GET_LOGOUT_USER): {    
            localStorage.clear()
            sessionStorage.clear()
            return { ...initialState }
        }
        default: return state;
    }
}