import { getFailure, getSuccess, getRequest} from '../index.js';

import { GET_CONTENT_SEARCH, GET_CONTENT_DETAILS } from '../constants/search';

// GET Content by name
export const getContentSearchRequest = (payload) => {
    return {
        type: getRequest(GET_CONTENT_SEARCH),
        payload
    }
}

export const getContentSearchSuccess = (payload) => {
    return {
        type: getSuccess(GET_CONTENT_SEARCH),
        payload
    }
}

export const getContentSearchFailure = (payload) => {
    return {
        type: getFailure(GET_CONTENT_SEARCH),
        payload
    }
}

// GET Content Details
export const getOverviewDetailsRequest = (payload) => {
    return {
        type: getRequest(GET_CONTENT_DETAILS),
        payload
    }
}

export const getOverviewDetailsSuccess = (payload) => {
    return {
        type: getSuccess(GET_CONTENT_DETAILS),
        payload
    }
}

export const getOverviewDetailsFailure = (payload) => {
    return {
        type: getFailure(GET_CONTENT_DETAILS),
        payload
    }
}