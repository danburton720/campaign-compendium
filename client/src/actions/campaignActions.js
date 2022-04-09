import axios from 'axios';
import { API } from '../config/api';

export const SET_CAMPAIGNS_PENDING = 'SET_CAMPAIGNS_PENDING';
export const SET_CREATED_CAMPAIGNS = 'SET_CREATED_CAMPAIGNS';
export const SET_PLAYER_CAMPAIGNS = 'SET_PLAYER_CAMPAIGNS';

export const SET_CAMPAIGN_PENDING = 'SET_CAMPAIGN_PENDING';
export const SET_CAMPAIGN_DATA = 'SET_CAMPAIGN_DATA';
export const SET_CAMPAIGN_ERROR = 'SET_CAMPAIGN_ERROR';

export const UPDATE_CAMPAIGN_NAME = 'UPDATE_CAMPAIGN_NAME';
export const UPDATE_CAMPAIGN_DESCRIPTION = 'UPDATE_CAMPAIGN_DESCRIPTION';

export const UPDATE_CAMPAIGN_CHARACTER = 'UPDATE_CAMPAIGN_CHARACTER';

export function setCampaignsPending(pending) {
    return {
        type: SET_CAMPAIGNS_PENDING,
        payload: pending
    }
}

export function setCreatedCampaigns(campaigns) {
    return {
        type: SET_CREATED_CAMPAIGNS,
        payload: campaigns
    };
}

export function setPlayerCampaigns(campaigns) {
    return {
        type: SET_PLAYER_CAMPAIGNS,
        payload: campaigns
    };
}

export function setCampaignPending(pending) {
    return {
        type: SET_CAMPAIGN_PENDING,
        payload: pending
    }
}

export function setCampaignData(data) {
    return {
        type: SET_CAMPAIGN_DATA,
        payload: data
    }
}

export function setCampaignError(error) {
    return {
        type: SET_CAMPAIGN_ERROR,
        payload: error
    }
}

export function updateCampaignName(name) {
    return {
        type: UPDATE_CAMPAIGN_NAME,
        payload: name
    }
}

export function updateCampaignDescription(description) {
    return {
        type: UPDATE_CAMPAIGN_DESCRIPTION,
        payload: description
    }
}

export function updateCampaignCharacter(id, character) {
    return {
        type: UPDATE_CAMPAIGN_CHARACTER,
        payload: { id, character }
    }
}

export function getAllCampaigns() {
    return async dispatch => {
        dispatch(setCampaignsPending(true));
        dispatch(setCreatedCampaigns([]));
        dispatch(setPlayerCampaigns([]));
        try {
            const createdCampaignsResponse = await axios.get(API.campaigns.created, { withCredentials: true });
            if (createdCampaignsResponse.data) {
                dispatch(setCreatedCampaigns(createdCampaignsResponse.data));
            }
            const playerCampaignsResponse = await axios.get(API.campaigns.player, { withCredentials: true });
            if (playerCampaignsResponse.data) {
                dispatch(setPlayerCampaigns(playerCampaignsResponse.data));
            }
            dispatch(setCampaignsPending(false));
        } catch (err) {
            dispatch(setCampaignsPending(false));
        }
    };
}

export function getCampaign(id) {
    return async dispatch => {
        dispatch(setCampaignPending(true));
        dispatch(setCampaignData([]));
        dispatch(setCampaignError(null));
        try {
            const endpoint = API.campaigns.campaign.replaceAll('{campaignId}', id);
            const response = await axios.get(endpoint, { withCredentials: true });
            dispatch(setCampaignData(response.data));
            dispatch(setCampaignPending(false));
        } catch (err) {
            dispatch(setCampaignError(err.message));
            dispatch(setCampaignPending(true));
        }
    }
}

