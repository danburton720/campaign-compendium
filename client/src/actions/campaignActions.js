import axios from 'axios';
import { API } from '../config/api';

export const SET_CAMPAIGNS_PENDING = 'SET_CAMPAIGNS_PENDING';
export const SET_CREATED_CAMPAIGNS = 'SET_CREATED_CAMPAIGNS';
export const SET_PLAYER_CAMPAIGNS = 'SET_PLAYER_CAMPAIGNS';

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

