import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

const Campaigns = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);

    if (currentUserPending) {
        return (
            <Box display='flex' width='100%' height='100vh'>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Typography variant="h1" color="textSecondary" sx={{ fontWeight: 400 }}>Hello, <strong>{currentUser.firstName}</strong></Typography>
        </>
    );
};

export default Campaigns;