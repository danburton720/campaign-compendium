import axios from 'axios';
import { API } from '../config/api';

export const SET_QUESTS_PENDING = 'SET_QUESTS_PENDING';
export const SET_QUESTS_DATA = 'SET_QUESTS_DATA';
export const SET_QUESTS_ERROR = 'SET_QUESTS_ERROR';
export const SET_DELETE_QUEST_PENDING = 'SET_DELETE_QUEST_PENDING';
export const SET_DELETE_QUEST_SUCCESS = 'SET_DELETE_QUEST_SUCCESS';
export const SET_DELETE_QUEST_ERROR = 'SET_DELETE_QUEST_ERROR';
export const DELETE_QUEST_IN_STORE = 'DELETE_QUEST_IN_STORE';
export const SET_ADD_QUEST_PENDING = 'SET_ADD_QUEST_PENDING';
export const SET_ADD_QUEST_SUCCESS = 'SET_ADD_QUEST_SUCCESS';
export const SET_ADD_QUEST_ERROR = 'SET_ADD_QUEST_ERROR';
export const SET_EDIT_QUEST_PENDING = 'SET_EDIT_QUEST_PENDING';
export const SET_EDIT_QUEST_SUCCESS = 'SET_EDIT_QUEST_SUCCESS';
export const SET_EDIT_QUEST_ERROR = 'SET_EDIT_QUEST_ERROR';

export function setQuestsPending(pending) {
    return {
        type: SET_QUESTS_PENDING,
        payload: pending
    }
}

export function setQuestsData(data) {
    return {
        type: SET_QUESTS_DATA,
        payload: data
    }
}

export function setQuestsError(error) {
    return {
        type: SET_QUESTS_ERROR,
        payload: error
    }
}

export function setDeleteQuestPending(pending) {
    return {
        type: SET_DELETE_QUEST_PENDING,
        payload: pending
    }
}

export function setDeleteQuestSuccess(success) {
    return {
        type: SET_DELETE_QUEST_SUCCESS,
        payload: success
    }
}

export function setDeleteQuestError(error) {
    return {
        type: SET_DELETE_QUEST_ERROR,
        payload: error
    }
}

export function deleteQuestInStore(questId) {
    return {
        type: DELETE_QUEST_IN_STORE,
        payload: questId
    }
}

export function setAddQuestPending(pending) {
    return {
        type: SET_ADD_QUEST_PENDING,
        payload: pending
    }
}

export function setAddQuestSuccess(success) {
    return {
        type: SET_ADD_QUEST_SUCCESS,
        payload: success
    }
}

export function setAddQuestError(error) {
    return {
        type: SET_ADD_QUEST_ERROR,
        payload: error
    }
}

export function setEditQuestPending(pending) {
    return {
        type: SET_EDIT_QUEST_PENDING,
        payload: pending
    }
}

export function setEditQuestSuccess(success) {
    return {
        type: SET_EDIT_QUEST_SUCCESS,
        payload: success
    }
}

export function setEditQuestError(error) {
    return {
        type: SET_EDIT_QUEST_ERROR,
        payload: error
    }
}

export function getAllQuests(campaignId) {
    return async dispatch => {
        dispatch(setQuestsPending(true));
        dispatch(setQuestsData([]));
        dispatch(setQuestsError(null));
        try {
            const endpoint = API.campaigns.quests.replaceAll('{campaignId}', campaignId);
            const questsResponse = await axios.get(endpoint, { withCredentials: true });
            dispatch(setQuestsData(questsResponse.data));
            dispatch(setQuestsPending(false));
        } catch (err) {
            dispatch(setQuestsError(err.response.data));
            dispatch(setQuestsPending(false));
        }
    };
}

export function deleteQuest(questId) {
    return async dispatch => {
        dispatch(setDeleteQuestPending(true));
        dispatch(setDeleteQuestSuccess(false));
        dispatch(setDeleteQuestError(null));
        try {
            const endpoint = API.quests.quest.replaceAll('{questId}', questId);
            await axios.delete(endpoint, { withCredentials: true });
            dispatch(deleteQuestInStore(questId));
            dispatch(setDeleteQuestSuccess(true));
            dispatch(setDeleteQuestPending(false));
        } catch (err) {
            dispatch(setDeleteQuestError(err.response.data));
            dispatch(setDeleteQuestPending(false));
        }
    };
}

export function addQuest(campaignId, title, description, giverName, milestones, characters) {
    return async dispatch => {
        dispatch(setAddQuestPending(true));
        dispatch(setAddQuestSuccess(false));
        dispatch(setAddQuestError(null));
        try {
            const endpoint = API.campaigns.quests.replaceAll('{campaignId}', campaignId);
            await axios.post(endpoint, { title, description, giverName, milestones, characters }, { withCredentials: true });
            dispatch(setAddQuestSuccess(true));
            dispatch(setAddQuestPending(false));
        } catch (err) {
            dispatch(setAddQuestError(err.response.data));
            dispatch(setAddQuestPending(false));
        }
    };
}

export function editQuest(questId, title, description, giverName, milestones, characters) {
    return async dispatch => {
        dispatch(setEditQuestPending(true));
        dispatch(setEditQuestSuccess(false));
        dispatch(setEditQuestError(null));
        try {
            const endpoint = API.quests.quest.replaceAll('{questId}', questId);
            await axios.patch(endpoint, { title, description, giverName, milestones, characters }, { withCredentials: true });
            dispatch(setEditQuestSuccess(true));
            dispatch(setEditQuestPending(false));
        } catch (err) {
            dispatch(setEditQuestError(err.response.data));
            dispatch(setEditQuestPending(false));
        }
    };
}