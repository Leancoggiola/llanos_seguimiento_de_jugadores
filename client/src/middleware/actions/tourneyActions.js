import { getFailure, getSuccess, getRequest } from '../index.js';

import {
    TOURNEY_GET_TOURNEY_LIST,
    TOURNEY_POST_NEW_TOURNEY,
    TOURNEY_DELETE_NEW_TOURNEY,
    TOURNEY_PUT_TOURNEY,
} from '../constants/tourney.js';

// GET Tourney LIST
export const getTourneysRequest = (payload) => {
    return {
        type: getRequest(TOURNEY_GET_TOURNEY_LIST),
        payload,
    };
};

export const getTourneysSuccess = (payload) => {
    return {
        type: getSuccess(TOURNEY_GET_TOURNEY_LIST),
        payload,
    };
};

export const getTourneysFailure = (payload) => {
    return {
        type: getFailure(TOURNEY_GET_TOURNEY_LIST),
        payload,
    };
};
// POST Tourney
export const postTourneyRequest = (payload) => {
    return {
        type: getRequest(TOURNEY_POST_NEW_TOURNEY),
        payload,
    };
};

export const postTourneySuccess = (payload) => {
    return {
        type: getSuccess(TOURNEY_POST_NEW_TOURNEY),
        payload,
    };
};

export const postTourneyFailure = (payload) => {
    return {
        type: getFailure(TOURNEY_POST_NEW_TOURNEY),
        payload,
    };
};
// PUT Tourney
export const putTourneyRequest = (payload) => {
    return {
        type: getRequest(TOURNEY_PUT_TOURNEY),
        payload,
    };
};

export const putTourneySuccess = (payload) => {
    return {
        type: getSuccess(TOURNEY_PUT_TOURNEY),
        payload,
    };
};

export const putTourneyFailure = (payload) => {
    return {
        type: getFailure(TOURNEY_PUT_TOURNEY),
        payload,
    };
};
// DELETE Tourney
export const deleteTourneyRequest = (payload) => {
    return {
        type: getRequest(TOURNEY_DELETE_NEW_TOURNEY),
        payload,
    };
};

export const deleteTourneySuccess = (payload) => {
    return {
        type: getSuccess(TOURNEY_DELETE_NEW_TOURNEY),
        payload,
    };
};

export const deleteTourneyFailure = (payload) => {
    return {
        type: getFailure(TOURNEY_DELETE_NEW_TOURNEY),
        payload,
    };
};
