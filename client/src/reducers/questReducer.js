import {
    SET_QUESTS_PENDING,
    SET_QUESTS_DATA,
    SET_QUESTS_ERROR,
    SET_DELETE_QUEST_PENDING,
    SET_DELETE_QUEST_SUCCESS,
    SET_DELETE_QUEST_ERROR,
    DELETE_QUEST_IN_STORE,
    SET_ADD_QUEST_PENDING,
    SET_ADD_QUEST_SUCCESS,
    SET_ADD_QUEST_ERROR
} from '../actions/questActions';

const initialState = {
    pending: false,
    data: [],
    error: null,
    deletePending: false,
    deleteSuccess: false,
    deleteError: null,
    addPending: false,
    addSuccess: false,
    addError: false
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
        case SET_DELETE_QUEST_PENDING:
            return {
                ...state,
                deletePending: action.payload
            }
        case SET_DELETE_QUEST_SUCCESS:
            return {
                ...state,
                deleteSuccess: action.payload
            }
        case SET_DELETE_QUEST_ERROR:
            return {
                ...state,
                deleteError: action.payload
            }
        case DELETE_QUEST_IN_STORE:
            const newData = [ ...state.data ];
            const newDataWithoutDeletedQuest = newData.filter(quest => quest._id !== action.payload);
            return {
                ...state,
                data: newDataWithoutDeletedQuest
            }
        case SET_ADD_QUEST_PENDING:
            return {
                ...state,
                addPending: action.payload
            }
        case SET_ADD_QUEST_SUCCESS:
            return {
                ...state,
                addSuccess: action.payload
            }
        case SET_ADD_QUEST_ERROR:
            return {
                ...state,
                addError: action.payload
            }
        default:
            return state;
    }
};

export default questsReducer;