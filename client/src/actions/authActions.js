import { useEffect } from 'react';
import axios from 'axios';
import { API } from '../config/api';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function setCurrentUser(currentUser) {
    return {
        type: SET_CURRENT_USER,
        payload: currentUser
    }
}

export function getCurrentUser() {
    return async dispatch => {
        try {
            const response = await axios.get(API.user.user, { withCredentials: true });
            console.log('response', response)
            if (response.data) {
                dispatch(setCurrentUser(response.data));
            }
        } catch (err) {

        }
    }
}

