import {
    NAVBAR_BACK,
    NAVBAR_NEW_ENTRY,
    UPDATE_TOAST_INFO,
    CHANGE_PAGE_TO_DISPLAY,
} from '../constants/navbar';

const initialState = {
    navbarPosition: [],
    toastInfo: {},
    display: '',
};

export const navbarReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        // GET User List
        case NAVBAR_BACK: {
            if (payload) return { ...state, navbarPosition: [] };
            const cia = state.navbarPosition.pop();
            cia.action(cia.param);
            return {
                ...state,
                navbarPosition: [...state.navbarPosition],
            };
        }
        case NAVBAR_NEW_ENTRY: {
            return {
                ...state,
                navbarPosition: [...state.navbarPosition.concat(payload)],
            };
        }
        case UPDATE_TOAST_INFO: {
            return {
                ...state,
                toastInfo: payload,
            };
        }
        case CHANGE_PAGE_TO_DISPLAY: {
            return {
                ...state,
                display: payload,
            };
        }
        default:
            return state;
    }
};
