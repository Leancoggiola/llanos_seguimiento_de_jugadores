import { NAVBAR_NEW_ENTRY, NAVBAR_BACK, UPDATE_TOAST_INFO, CHANGE_PAGE_TO_DISPLAY } from '../constants/navbar.js';

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

export const changePageToDisplay = (payload) => {
    return {
        type: CHANGE_PAGE_TO_DISPLAY,
        payload
    }
}