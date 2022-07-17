import {
    SET_QUESTS_PENDING,
    SET_QUESTS_DATA,
    SET_QUESTS_ERROR,
} from '../actions/questActions';

const initialState = {
    pending: false,
    data: [],
    error: null
};

const questsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUESTS_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        case SET_QUESTS_DATA:
            return {
                ...state,
                data: action.payload
            };
        case SET_QUESTS_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default questsReducer;