import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import backgroundImage from '../assets/bg.png';
import AccountMenu from '../components/AccountMenu';

const PageWrapper = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Box display="flex" sx={{ background: 'black' }}>
            <Container
                maxWidth="xl"
                disableGutters
                sx={{
                    position: 'relative',
                    paddingTop: '5rem',
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                    paddingBottom: '2rem',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                }}
            >
                <Box sx={{ position: 'absolute', top: '2rem', right: '2rem'}}><AccountMenu /></Box>
                <Outlet />
            </Container>
        </Box>
    )
}

export default PageWrapper;