import React from 'react';
import { Provider } from 'react-redux';

import Routes from './pages/Routes';
import configureStore from './config/store';
import { loadState, saveState } from './config/localStorage';

const persistedState = loadState();

const store = configureStore(persistedState);

store.subscribe(() => {
    saveState(store.getState());
});

const App = () => {
    return (
        <Provider store={store}>
            <Routes />
        </Provider>
    );
}

export default App;
