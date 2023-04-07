import { getFailure, getSuccess, getRequest} from '../index.js';

import { TOURNEY_GET_TOURNEY_LIST } from '../constants/tourney.js';

// GET APPs LIST
export const getTourneysRequest = (payload) => {
    return {
        type: getRequest(TOURNEY_GET_TOURNEY_LIST),
        payload
    }
}

export const getTourneysSuccess = (payload) => {
    return {
        type: getSuccess(TOURNEY_GET_TOURNEY_LIST),
        payload
    }
}

export const getTourneysFailure = (payload) => {
    return {
        type: getFailure(TOURNEY_GET_TOURNEY_LIST),
        payload
    }
}