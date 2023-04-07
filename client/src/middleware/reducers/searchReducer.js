import { getFailure, getSuccess, getRequest} from '../index.js';
import { GET_CONTENT_SEARCH, GET_CONTENT_DETAILS } from '../constants/search';

const defaultState = { loading: false, data: null, error: null }

const initialState = { 
    resultsList: {...defaultState},
    contentDetails: {...defaultState},
}

export const searchReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET Content by name
        case getRequest(GET_CONTENT_SEARCH): {
            return {
                ...state,
                resultsList: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(GET_CONTENT_SEARCH): {
            return {
                ...state,
                resultsList: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(GET_CONTENT_SEARCH): {
            return {
                ...state,
                resultsList: { loading: false, data: null, error: payload }
            }
        }
        // GET Content Details
        case getRequest(GET_CONTENT_DETAILS): {
            return {
                ...state,
                contentDetails: { loading: true, data: null, error: null }
            }
        }
        case getSuccess(GET_CONTENT_DETAILS): {
            return {
                ...state,
                contentDetails: { loading: false, data: payload, error: null }
            }
        }
        case getFailure(GET_CONTENT_DETAILS): {
            return {
                ...state,
                contentDetails: { loading: false, data: null, error: payload }
            }
        }
        default: return state;
    }
}