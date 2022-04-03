import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { isEmpty } from 'ramda';

import backgroundImage from '../assets/bg.png';
import { API } from '../config/api';
import { getCurrentUser } from '../actions/authActions';
import { ROUTES } from '../constants';
import CustomButton from '../components/UI/CustomButton';

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
        window.open(API.auth.google, '_self');
    };

    return (
        <Container
            maxWidth='none'
            sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            }}
        >
            <Box height='100%' width='100%' display='flex' flexDirection='column' alignItems='center'>
                <Box display="flex" flexDirection="column" alignItems='center' gap={2} marginTop='25vh' marginBottom='9vh'>
                    <Typography variant="h1">Welcome, adventurer</Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center'}}>Welcome to <strong>Campaign Compendium</strong>. Please login with your Google account to get started</Typography>
                </Box>
                <CustomButton
                    onClick={googleLogin}
                    startIcon={<GoogleIcon/>}
                >
                    Login with Google
                </CustomButton>
                <Box />
            </Box>
        </Container>
    );
};

export default Login;