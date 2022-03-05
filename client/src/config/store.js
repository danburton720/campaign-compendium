import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

const middleware = [thunk];

if (process.env.NODE_ENV === `development`) {
    const { logger } = require(`redux-logger`);
    middleware.push(logger);
}

export default function configureStore(state) {
    return createStore(
        rootReducer,
        state,
        composeWithDevTools(applyMiddleware(...middleware))
    );
}