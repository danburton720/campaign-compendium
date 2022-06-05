import {
    SET_CAMPAIGN_CHARACTERS_PENDING,
    SET_CAMPAIGN_CHARACTERS_DATA,
    SET_CAMPAIGN_CHARACTERS_ERROR
} from '../actions/characterActions';

const initialState = {
    pending: false,
    data: [],
    error: null
}

const characterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CAMPAIGN_CHARACTERS_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        case SET_CAMPAIGN_CHARACTERS_DATA:
            return {
                ...state,
                data: action.payload
            }
        case SET_CAMPAIGN_CHARACTERS_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}

export default characterReducer;
