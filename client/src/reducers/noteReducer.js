import {
    SET_NOTES_PENDING,
    SET_NOTES_DATA,
    SET_NOTES_ERROR,
    SET_UPDATE_NOTE_PENDING,
    SET_UPDATE_NOTE_SUCCESS,
    SET_UPDATE_NOTE_ERROR,
    SET_DELETE_NOTE_PENDING,
    SET_DELETE_NOTE_SUCCESS,
    SET_DELETE_NOTE_ERROR,
    SET_ADD_NOTE_PENDING,
    SET_ADD_NOTE_SUCCESS,
    SET_ADD_NOTE_ERROR,
    UPDATE_NOTE_IN_STORE,
    DELETE_NOTE_IN_STORE,
    ADD_NOTE_TO_STORE
} from '../actions/noteActions';

const initialState = {
    pending: false,
    data: [],
    error: null,
    updatePending: false,
    updateSuccess: false,
    updateError: null,
    deletePending: false,
    deleteSuccess: false,
    deleteError: null,
    addPending: false,
    addSuccess: false,
    addError: null,
};

const sessionUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTES_PENDING:
            return {
                ...state,
                pending: action.payload
            }
        case SET_NOTES_DATA:
            return {
                ...state,
                data: action.payload
            };
        case SET_NOTES_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case SET_UPDATE_NOTE_PENDING:
            return {
                ...state,
                updatePending: action.payload
            }
        case SET_UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                updateSuccess: action.payload
            };
        case SET_UPDATE_NOTE_ERROR:
            return {
                ...state,
                updateError: action.payload
            };
        case UPDATE_NOTE_IN_STORE:
            const indexToUpdate = state.data.findIndex(item => item._id === action.payload.noteId)
            const newNotesToUpdate = state.data;
            if (indexToUpdate !== -1) {
                newNotesToUpdate[indexToUpdate].relatedCharacter = action.payload.relatedCharacter;
                newNotesToUpdate[indexToUpdate].content = action.payload.content;
            }

            return {
                ...state,
                data: newNotesToUpdate
            }
        case SET_DELETE_NOTE_PENDING:
            return {
                ...state,
                deletePending: action.payload
            }
        case SET_DELETE_NOTE_SUCCESS:
            return {
                ...state,
                deleteSuccess: action.payload
            };
        case SET_DELETE_NOTE_ERROR:
            return {
                ...state,
                deleteError: action.payload
            };
        case DELETE_NOTE_IN_STORE:
            const newNotesWithoutDeletedNote = state.data.filter(item => item._id !== action.payload);

            return {
                ...state,
                data: newNotesWithoutDeletedNote
            }
        case SET_ADD_NOTE_PENDING:
            return {
                ...state,
                addPending: action.payload
            }
        case SET_ADD_NOTE_SUCCESS:
            return {
                ...state,
                addSuccess: action.payload
            };
        case SET_ADD_NOTE_ERROR:
            return {
                ...state,
                addError: action.payload
            };
        case ADD_NOTE_TO_STORE:
            const newNotesToAddTo = state.data;
            newNotesToAddTo.push(action.payload);
            const newNotesToAddToSorted = newNotesToAddTo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                ...state,
                data: newNotesToAddToSorted
            }
        default:
            return state;
    }
};

export default sessionUpdateReducer;