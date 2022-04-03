import {
    SET_CAMPAIGNS_PENDING, SET_CREATED_CAMPAIGNS, SET_PLAYER_CAMPAIGNS,
} from '../actions/campaignActions';

const initialState = {
    campaignsPending: false,
    createdCampaigns: [],
    playerCampaigns: []
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
        default:
            return state;
    }
};

export default campaignReducer;