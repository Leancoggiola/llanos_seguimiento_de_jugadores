import { getFailure, getSuccess, getRequest } from '../index.js';

import {
    TEAM_GET_TEAM_LIST,
    TEAM_POST_NEW_TEAM,
    TEAM_DELETE_NEW_TEAM,
    TEAM_PUT_TEAM,
} from '../constants/team.js';

// GET Team LIST
export const getTeamsRequest = (payload) => {
    return {
        type: getRequest(TEAM_GET_TEAM_LIST),
        payload,
    };
};

export const getTeamsSuccess = (payload) => {
    return {
        type: getSuccess(TEAM_GET_TEAM_LIST),
        payload,
    };
};

export const getTeamsFailure = (payload) => {
    return {
        type: getFailure(TEAM_GET_TEAM_LIST),
        payload,
    };
};
// POST Team
export const postTeamRequest = (payload) => {
    return {
        type: getRequest(TEAM_POST_NEW_TEAM),
        payload,
    };
};

export const postTeamSuccess = (payload) => {
    return {
        type: getSuccess(TEAM_POST_NEW_TEAM),
        payload,
    };
};

export const postTeamFailure = (payload) => {
    return {
        type: getFailure(TEAM_POST_NEW_TEAM),
        payload,
    };
};
// PUT Team
export const putTeamRequest = (payload) => {
    return {
        type: getRequest(TEAM_PUT_TEAM),
        payload,
    };
};

export const putTeamSuccess = (payload) => {
    return {
        type: getSuccess(TEAM_PUT_TEAM),
        payload,
    };
};

export const putTeamFailure = (payload) => {
    return {
        type: getFailure(TEAM_PUT_TEAM),
        payload,
    };
};
// DELETE Team
export const deleteTeamRequest = (payload) => {
    return {
        type: getRequest(TEAM_DELETE_NEW_TEAM),
        payload,
    };
};

export const deleteTeamSuccess = (payload) => {
    return {
        type: getSuccess(TEAM_DELETE_NEW_TEAM),
        payload,
    };
};

export const deleteTeamFailure = (payload) => {
    return {
        type: getFailure(TEAM_DELETE_NEW_TEAM),
        payload,
    };
};
