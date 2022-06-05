import axios from 'axios';
import { API } from '../config/api';
import { setCampaignsPending, setCreatedCampaigns, setPlayerCampaigns } from './campaignActions';

export const SET_CAMPAIGN_CHARACTERS_PENDING = 'SET_CAMPAIGN_CHARACTERS_PENDING';
export const SET_CAMPAIGN_CHARACTERS_DATA = 'SET_CAMPAIGN_CHARACTERS_DATA';
export const SET_CAMPAIGN_CHARACTERS_ERROR = 'SET_CAMPAIGN_CHARACTERS_ERROR';

export function setCampaignCharactersPending(pending) {
    return {
        type: SET_CAMPAIGN_CHARACTERS_PENDING,
        payload: pending
    }
}

export function setCampaignCharactersData(data) {
    return {
        type: SET_CAMPAIGN_CHARACTERS_DATA,
        payload: data
    }
}

export function setCampaignCharactersError(error) {
    return {
        type: SET_CAMPAIGN_CHARACTERS_ERROR,
        payload: error
    }
}

export function getAllCampaignCharacters(campaignId) {
    return async dispatch => {
        dispatch(setCampaignCharactersPending(true));
        dispatch(setCampaignCharactersData([]));
        dispatch(setCampaignCharactersError(null));
        try {
            const endpoint = API.campaigns.characters.replaceAll('{campaignId}', campaignId);

            const response = await axios.get(endpoint, { withCredentials: true });
            dispatch(setCampaignCharactersData(response.data));
            dispatch(setCampaignCharactersPending(false));
        } catch (err) {
            dispatch(setCampaignCharactersPending(false));
            setCampaignCharactersError(err.response.data);
        }
    };
}
