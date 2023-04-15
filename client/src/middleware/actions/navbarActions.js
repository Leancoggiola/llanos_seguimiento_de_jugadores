import { NAVBAR_NEW_ENTRY, NAVBAR_BACK, UPDATE_TOAST_INFO } from '../constants/navbar.js';

export const navbarNewEntry = (payload) => {
    return {
        type: NAVBAR_NEW_ENTRY,
        payload
    }
}

export const navbarBack = (payload) => {
    return {
        type: NAVBAR_BACK,
        payload
    }
}

export const updateToastData = (payload) => {
    return {
        type: UPDATE_TOAST_INFO,
        payload
    }
}