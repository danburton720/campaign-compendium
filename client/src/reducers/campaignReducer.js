import {
    SET_CAMPAIGNS_PENDING,
    SET_CREATED_CAMPAIGNS,
    SET_PLAYER_CAMPAIGNS,
    SET_CAMPAIGN_PENDING,
    SET_CAMPAIGN_DATA,
    SET_CAMPAIGN_ERROR,
    UPDATE_CAMPAIGN_NAME,
    UPDATE_CAMPAIGN_DESCRIPTION,
    UPDATE_CAMPAIGN_CHARACTER,
    REMOVE_CAMPAIGN_CHARACTER,
    KILL_CAMPAIGN_CHARACTER,
    REVIVE_CAMPAIGN_CHARACTER
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
        case UPDATE_CAMPAIGN_NAME:
            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    name: action.payload
                }
            }
        case UPDATE_CAMPAIGN_DESCRIPTION:
            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    description: action.payload
                }
            }
        case UPDATE_CAMPAIGN_CHARACTER:
            const characterToUpdateIndex = state.campaignData?.characters?.findIndex(character => character._id === action.payload.id) || -1;
            const newCharacters = state.campaignData?.characters || [];
            if (characterToUpdateIndex !== -1 && newCharacters.length > 0) {
                newCharacters[characterToUpdateIndex] = action.payload.character;
            }

            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    characters: newCharacters
                }
            }
        case REMOVE_CAMPAIGN_CHARACTER:
            const allOtherCharacters = state.campaignData?.characters?.filter(character => character._id !== action.payload) || [];
            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    characters: allOtherCharacters
                }
            }
        case KILL_CAMPAIGN_CHARACTER:
            const characterToKillIndex = state.campaignData?.characters?.findIndex(character => character._id === action.payload.id) || -1;
            const newCharacters2 = state.campaignData?.characters || [];
            if (characterToKillIndex !== -1 && newCharacters2.length > 0) {
                newCharacters2[characterToKillIndex].status = 'dead';
            }

            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    characters: newCharacters2
                }
            }
        case REVIVE_CAMPAIGN_CHARACTER:
            const characterToReviveIndex = state.campaignData?.characters?.findIndex(character => character._id === action.payload.id) || -1;
            const newCharacters3 = state.campaignData?.characters || [];
            if (characterToReviveIndex !== -1 && newCharacters3.length > 0) {
                newCharacters3[characterToReviveIndex].status = 'active';
            }

            return {
                ...state,
                campaignData: {
                    ...state.campaignData,
                    characters: newCharacters3
                }
            }
        default:
            return state;
    }
};

export default campaignReducer;