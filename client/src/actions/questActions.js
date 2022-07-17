import axios from 'axios';
import { API } from '../config/api';

export const SET_QUESTS_PENDING = 'SET_QUESTS_PENDING';
export const SET_QUESTS_DATA = 'SET_QUESTS_DATA';
export const SET_QUESTS_ERROR = 'SET_QUESTS_ERROR';

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
