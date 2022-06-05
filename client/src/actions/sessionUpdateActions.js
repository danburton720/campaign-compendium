import axios from 'axios';
import { API } from '../config/api';

export const SET_SESSION_UPDATES_PENDING = 'SET_SESSION_UPDATES_PENDING';
export const SET_SESSION_UPDATES_DATA = 'SET_SESSION_UPDATES_DATA';
export const SET_SESSION_UPDATES_ERROR = 'SET_SESSION_UPDATES_ERROR';

export function setSessionUpdatesPending(pending) {
    return {
        type: SET_SESSION_UPDATES_PENDING,
        payload: pending
    }
}

export function setSessionUpdatesData(data) {
    return {
        type: SET_SESSION_UPDATES_DATA,
        payload: data
    }
}

export function setSessionUpdatesError(error) {
    return {
        type: SET_SESSION_UPDATES_ERROR,
        payload: error
    }
}

export function getAllSessionUpdates(campaignId) {
    return async dispatch => {
        dispatch(setSessionUpdatesPending(true));
        dispatch(setSessionUpdatesData([]));
        dispatch(setSessionUpdatesError(null));
        try {
            const endpoint = API.campaigns.session_updates.replaceAll('{campaignId}', campaignId);
            const sessionUpdatesResponse = await axios.get(endpoint, { withCredentials: true });
            dispatch(setSessionUpdatesData(sessionUpdatesResponse.data));
            dispatch(setSessionUpdatesPending(false));
        } catch (err) {
            dispatch(setSessionUpdatesError(err.response.data));
            dispatch(setSessionUpdatesPending(false));
        }
    };
}

