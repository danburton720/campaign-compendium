import axios from 'axios';
import { API } from '../config/api';

export const SET_NOTES_PENDING = 'SET_NOTES_PENDING';
export const SET_NOTES_DATA = 'SET_NOTES_DATA';
export const SET_NOTES_ERROR = 'SET_NOTES_ERROR';
export const SET_UPDATE_NOTE_PENDING = 'SET_UPDATE_NOTE_PENDING';
export const SET_UPDATE_NOTE_SUCCESS = 'SET_UPDATE_NOTE_SUCCESS';
export const SET_UPDATE_NOTE_ERROR = 'SET_UPDATE_NOTE_ERROR';
export const UPDATE_NOTE_IN_STORE = 'UPDATE_NOTE_IN_STORE';
export const SET_DELETE_NOTE_PENDING = 'SET_DELETE_NOTE_PENDING';
export const SET_DELETE_NOTE_SUCCESS = 'SET_DELETE_NOTE_SUCCESS';
export const SET_DELETE_NOTE_ERROR = 'SET_DELETE_NOTE_ERROR';
export const DELETE_NOTE_IN_STORE = 'DELETE_NOTE_IN_STORE';
export const SET_ADD_NOTE_PENDING = 'SET_ADD_NOTE_PENDING';
export const SET_ADD_NOTE_SUCCESS = 'SET_ADD_NOTE_SUCCESS';
export const SET_ADD_NOTE_ERROR = 'SET_ADD_NOTE_ERROR';
export const ADD_NOTE_TO_STORE = 'ADD_NOTE_TO_STORE';

export function setNotesPending(pending) {
    return {
        type: SET_NOTES_PENDING,
        payload: pending
    }
}

export function setNotesData(data) {
    return {
        type: SET_NOTES_DATA,
        payload: data
    }
}

export function setNotesError(error) {
    return {
        type: SET_NOTES_ERROR,
        payload: error
    }
}

export function setUpdateNotePending(pending) {
    return {
        type: SET_UPDATE_NOTE_PENDING,
        payload: pending
    }
}

export function setUpdateNoteSuccess(success) {
    return {
        type: SET_UPDATE_NOTE_SUCCESS,
        payload: success
    }
}

export function setUpdateNoteError(error) {
    return {
        type: SET_UPDATE_NOTE_ERROR,
        payload: error
    }
}

export function updateNoteInStore(noteId, relatedCharacter, content) {
    return {
        type: UPDATE_NOTE_IN_STORE,
        payload: { noteId, relatedCharacter, content }
    }
}

export function setDeleteNotePending(pending) {
    return {
        type: SET_DELETE_NOTE_PENDING,
        payload: pending
    }
}

export function setDeleteNoteSuccess(success) {
    return {
        type: SET_DELETE_NOTE_SUCCESS,
        payload: success
    }
}

export function setDeleteNoteError(error) {
    return {
        type: SET_DELETE_NOTE_ERROR,
        payload: error
    }
}

export function deleteNoteInStore(noteId) {
    return {
        type: DELETE_NOTE_IN_STORE,
        payload: noteId
    }
}

export function setAddNotePending(pending) {
    return {
        type: SET_ADD_NOTE_PENDING,
        payload: pending
    }
}

export function setAddNoteSuccess(success) {
    return {
        type: SET_ADD_NOTE_SUCCESS,
        payload: success
    }
}

export function setAddNoteError(error) {
    return {
        type: SET_ADD_NOTE_ERROR,
        payload: error
    }
}

export function addNoteToStore(note) {
    return {
        type: ADD_NOTE_TO_STORE,
        payload: note
    }
}

export function getAllNotes(campaignId, params) {
    return async dispatch => {
        dispatch(setNotesPending(true));
        dispatch(setNotesData([]));
        dispatch(setNotesError(null));
        try {
            const endpoint = API.campaigns.notes.replaceAll('{campaignId}', campaignId);
            const response = await axios.get(endpoint, { params, withCredentials: true });
            dispatch(setNotesData(response.data));
            dispatch(setNotesPending(false));
        } catch (err) {
            dispatch(setNotesError(err.response.data));
            dispatch(setNotesPending(false));
        }
    };
}

export function updateNote(noteId, relatedCharacter, content) {
    return async dispatch => {
        dispatch(setUpdateNotePending(true));
        dispatch(setUpdateNoteSuccess(false));
        dispatch(setUpdateNoteError(null));
        try {
            const endpoint = API.notes.note.replaceAll('{noteId}', noteId);
            await axios.patch(endpoint, { relatedCharacter, content }, { withCredentials: true });
            dispatch(updateNoteInStore(noteId, relatedCharacter, content));
            dispatch(setUpdateNoteSuccess(true));
            dispatch(setUpdateNotePending(false));
        } catch (err) {
            dispatch(setUpdateNoteError(err.response.data));
            dispatch(setUpdateNotePending(false));
        }
    };
}

export function deleteNote(noteId) {
    return async dispatch => {
        dispatch(setDeleteNotePending(true));
        dispatch(setDeleteNoteSuccess(false));
        dispatch(setDeleteNoteError(null));
        try {
            const endpoint = API.notes.note.replaceAll('{noteId}', noteId);
            await axios.delete(endpoint, { withCredentials: true });
            dispatch(deleteNoteInStore(noteId));
            dispatch(setDeleteNoteSuccess(true));
            dispatch(setDeleteNotePending(false));
        } catch (err) {
            dispatch(setDeleteNoteError(err.response.data));
            dispatch(setDeleteNotePending(false));
        }
    };
}

export function addNote(campaignId, relatedCharacter, content) {
    return async dispatch => {
        dispatch(setAddNotePending(true));
        dispatch(setAddNoteSuccess(false));
        dispatch(setAddNoteError(null));
        try {
            const endpoint = API.campaigns.notes.replaceAll('{campaignId}', campaignId);
            const response = await axios.post(endpoint, { relatedCharacter, content }, { withCredentials: true });
            dispatch(addNoteToStore(response.data));
            dispatch(setAddNoteSuccess(true));
            dispatch(setAddNotePending(false));
        } catch (err) {
            dispatch(setAddNoteError(err.response.data));
            dispatch(setAddNotePending(false));
        }
    };
}
