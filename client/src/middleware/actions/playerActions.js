import { getFailure, getSuccess, getRequest} from '../index.js';

import { PLAYER_GET_PLAYER_LIST, PLAYER_POST_NEW_PLAYER, PLAYER_DELETE_NEW_PLAYER } from '../constants/player.js';

// GET Player LIST
export const getPlayersRequest = (payload) => {
    return {
        type: getRequest(PLAYER_GET_PLAYER_LIST),
        payload
    }
}

export const getPlayersSuccess = (payload) => {
    return {
        type: getSuccess(PLAYER_GET_PLAYER_LIST),
        payload
    }
}

export const getPlayersFailure = (payload) => {
    return {
        type: getFailure(PLAYER_GET_PLAYER_LIST),
        payload
    }
}
// POST Player
export const postPlayerRequest = (payload) => {
    return {
        type: getRequest(PLAYER_POST_NEW_PLAYER),
        payload
    }
}

export const postPlayerSuccess = (payload) => {
    return {
        type: getSuccess(PLAYER_POST_NEW_PLAYER),
        payload
    }
}

export const postPlayerFailure = (payload) => {
    return {
        type: getFailure(PLAYER_POST_NEW_PLAYER),
        payload
    }
}
// DELETE Player
export const deletePlayerRequest = (payload) => {
    return {
        type: getRequest(PLAYER_DELETE_NEW_PLAYER),
        payload
    }
}

export const deletePlayerSuccess = (payload) => {
    return {
        type: getSuccess(PLAYER_DELETE_NEW_PLAYER),
        payload
    }
}

export const deletePlayerFailure = (payload) => {
    return {
        type: getFailure(PLAYER_DELETE_NEW_PLAYER),
        payload
    }
}