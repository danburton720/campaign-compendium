import {
    SET_CAMPAIGNS_PENDING,
    SET_CREATED_CAMPAIGNS,
    SET_PLAYER_CAMPAIGNS,
    SET_CAMPAIGN_PENDING,
    SET_CAMPAIGN_DATA,
    SET_CAMPAIGN_ERROR
} from '../actions/campaignActions';

const initialState = {
    campaignsPending: false,
    createdCampaigns: [],
    playerCampaigns: [],
    campaignPending: false,
    campaignData: [],
    campaignError: null
};

const campaignReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CAMPAIGNS_PENDING:
            return {
                ...state,
                campaignsPending: action.payload
            }
        case SET_CREATED_CAMPAIGNS:
            return {
                ...state,
                createdCampaigns: action.payload
            };
        case SET_PLAYER_CAMPAIGNS:
            return {
                ...state,
                playerCampaigns: action.payload
            };
        case SET_CAMPAIGN_PENDING:
            return {
                ...state,
                campaignPending: action.payload
            }
        case SET_CAMPAIGN_DATA:
            return {
                ...state,
                campaignData: action.payload
            }
        case SET_CAMPAIGN_ERROR:
            return {
                ...state,
                campaignError: action.payload
            }
        default:
            return state;
    }
};

export default campaignReducer;