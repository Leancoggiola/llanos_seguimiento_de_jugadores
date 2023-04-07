import { getFailure, getRequest, getSuccess } from '../index.js';

import { GET_USER_LIST, POST_ITEM_TO_LIST, PUT_CHANGE_ITEM_ON_LIST, DELETE_ITEM_FROM_LIST, CHANGE_LIST_TO_DISPLAY } from '../constants/list';

// GET User List
export const getUserListRequest = (payload) => {
    return {
        type: getRequest(GET_USER_LIST),
        payload
    }
}

export const getUserListSuccess = (payload) => {
    return {
        type: getSuccess(GET_USER_LIST),
        payload
    }
}

export const getUserListFailure = (payload) => {
    return {
        type: getFailure(GET_USER_LIST),
        payload
    }
}

// Post Item to List
export const postItemToListRequest = (payload) => {
    return {
        type: getRequest(POST_ITEM_TO_LIST),
        payload
    }
}

export const postItemToListSuccess = (payload) => {
    return {
        type: getSuccess(POST_ITEM_TO_LIST),
        payload
    }
}

export const postItemToListFailure = (payload) => {
    return {
        type: getFailure(POST_ITEM_TO_LIST),
        payload
    }
}

// Update Item on List
export const putChangeItemOnListRequest = (payload) => {
    return {
        type: getRequest(PUT_CHANGE_ITEM_ON_LIST),
        payload
    }
}

export const putChangeItemOnListSuccess = (payload) => {
    return {
        type: getSuccess(PUT_CHANGE_ITEM_ON_LIST),
        payload
    }
}

export const putChangeItemOnListFailure = (payload) => {
    return {
        type: getFailure(PUT_CHANGE_ITEM_ON_LIST),
        payload
    }
}

// Delete Item from List
export const deleteItemFromListRequest = (payload) => {
    return {
        type: getRequest(DELETE_ITEM_FROM_LIST),
        payload
    }
}

export const deleteItemFromListSuccess = (payload) => {
    return {
        type: getSuccess(DELETE_ITEM_FROM_LIST),
        payload
    }
}

export const deleteItemFromListFailure = (payload) => {
    return {
        type: getFailure(DELETE_ITEM_FROM_LIST),
        payload
    }
}

// List to Display
export const changeListToDisplay = (payload) => {
    return {
        type: CHANGE_LIST_TO_DISPLAY,
        payload
    }
}