import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { isEmpty } from 'ramda';

import { API } from '../config/api';
import { getCurrentUser } from '../actions/authActions';
import { ROUTES } from '../constants';

const Login = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.currentUser);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, []);

    useEffect(() => {
        if (!isEmpty(currentUser)) {
            navigate(ROUTES.CAMPAIGNS);
        }
    }, [currentUser]);


    const googleLogin = () => {
        console.log('opening URL', API.auth.google);
        window.open(API.auth.google, '_self');
    };

    return (
        <>
            <Typography>Login page</Typography>
            <Button
                variant="contained"
                onClick={googleLogin}
                startIcon={<GoogleIcon/>}
            >
                Login with Google
            </Button>
        </>
    );
};

export default Login;