import { NAVBAR_BACK, NAVBAR_NEW_ENTRY} from '../constants/navbar';

const initialState = {
    navbarPosition: []
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
        default: return state;
    }
}