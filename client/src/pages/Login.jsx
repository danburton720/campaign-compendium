import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Link, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { isEmpty } from 'ramda';

import backgroundImage from '../assets/bg.png';
import { API } from '../config/api';
import { getCurrentUser } from '../actions/authActions';
import { ROUTES } from '../constants';
import CustomButton from '../components/UI/CustomButton';
import { extraPalette } from '../themes/mui';

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
                    <Typography variant="h1" sx={{ color: extraPalette.WHITE }}>Welcome, adventurer</Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center', color: extraPalette.WHITE }}>Welcome to <strong>Campaign Compendium</strong>. Please login with your Google account to get started</Typography>
                </Box>
                <CustomButton
                    onClick={googleLogin}
                    startIcon={<GoogleIcon/>}
                >
                    Login with Google
                </CustomButton>
                <Box />
                <Box marginTop='20rem' padding='2rem' textAlign='center'>
                    <Typography variant="subtitle2" sx={{ color: extraPalette.WHITE, fontWeight: 400 }}>By continuing, you agree to Campaign Compendium's <Link underline="none" href="https://www.privacypolicies.com/live/b395cb47-8727-4df3-9a6d-4ca9fc2c2341"><strong>Privacy Policy</strong></Link></Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;