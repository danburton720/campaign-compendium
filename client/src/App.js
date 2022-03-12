import React from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';

import Routes from './pages/Routes';
import configureStore from './config/store';
import { loadState, saveState } from './config/localStorage';
import { logout } from './actions/authActions';

const persistedState = loadState();

const store = configureStore(persistedState);
const { dispatch } = store;

store.subscribe(() => {
    saveState(store.getState());
});

axios.interceptors.response.use(response => {
        return response;
    },
    async error => {
        if (error.response && error.response.status === 401) {
            await dispatch(logout());
        }

        return Promise.reject(error);
    }
);

const App = () => {
    return (
        <Provider store={store}>
            <Routes/>
        </Provider>
    );
};

export default App;
