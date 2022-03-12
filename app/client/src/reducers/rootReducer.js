import { combineReducers } from 'redux';

import authReducer from './authReducer';
import { CLEAR_ALL_STORAGE } from '../actions/rootActions';

const appReducer = combineReducers({
    auth: authReducer,
});

const rootReducer = (state, action) => {
    if (action.type === CLEAR_ALL_STORAGE) {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;