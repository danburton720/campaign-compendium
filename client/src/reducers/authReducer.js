import {
    SET_CURRENT_USER, SET_CURRENT_USER_PENDING,
} from '../actions/authActions';

const initialState = {
    currentUser: {},
    currentUserPending: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER_PENDING:
            return {
                ...state,
                currentUserPending: action.payload
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;