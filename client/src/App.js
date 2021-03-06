import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Routes from './pages/Routes';
import configureStore from './config/store';
import { loadState, saveState } from './config/localStorage';
import { logout } from './actions/authActions';
import { mui_theme } from './themes/mui';
import SnackbarProvider from './utils/snackbar';

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
    const theme = createTheme(mui_theme);

    useEffect(() => {
        document.body.style.overflowY = 'scroll';
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider>
                        <Routes/>
                    </SnackbarProvider>
                </ThemeProvider>
            </Provider>
        </LocalizationProvider>
    );
};

export default App;
