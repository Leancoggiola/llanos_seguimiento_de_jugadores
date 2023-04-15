import { NAVBAR_BACK, NAVBAR_NEW_ENTRY, UPDATE_TOAST_INFO} from '../constants/navbar';

const initialState = {
    navbarPosition: [],
    toastInfo: {}
}

export const navbarReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        // GET User List
        case NAVBAR_BACK: {
            const cia = state.navbarPosition.pop()
            cia.action(cia.param)
            return {
                ...state,
                navbarPosition: [...state.navbarPosition]
            }
        }
        case NAVBAR_NEW_ENTRY: {
            return {
                ...state,
                navbarPosition: [...state.navbarPosition.concat(payload)]
            }
        }
        case UPDATE_TOAST_INFO: {
            return {
                ...state,
                toastInfo: payload
            }
        }
        default: return state;
    }
}