import {
    SET_SESSION_UPDATES_PENDING,
    SET_SESSION_UPDATES_DATA,
    SET_SESSION_UPDATES_ERROR
} from '../actions/sessionUpdateActions';

const initialState = {
    pending: false,
    data: [],
    error: null
};

const sessionUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSION_UPDATES_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        case SET_SESSION_UPDATES_DATA:
            return {
                ...state,
                data: action.payload
            };
        case SET_SESSION_UPDATES_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default sessionUpdateReducer;