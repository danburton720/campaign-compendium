import { combineReducers } from 'redux';

import authReducer from './authReducer';
import { CLEAR_ALL_STORAGE } from '../actions/rootActions';
import campaignReducer from './campaignReducer';
import sessionUpdateReducer from './sessionUpdateReducer';
import noteReducer from './noteReducer';
import characterReducer from './characterReducer';

const appReducer = combineReducers({
    auth: authReducer,
    campaigns: campaignReducer,
    sessionUpdates: sessionUpdateReducer,
    notes: noteReducer,
    characters: characterReducer
});

const rootReducer = (state, action) => {
    if (action.type === CLEAR_ALL_STORAGE) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;