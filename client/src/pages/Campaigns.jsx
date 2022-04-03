import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';

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
            <Box display="flex" flexDirection="column" marginTop='2rem'>
                <Typography variant="h3" color="textSecondary" sx={{ marginBottom: '1rem' }}>My campaigns</Typography>
                <Card sx={{ height: '300px', width: '350px', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h3">Start a new campaign</Typography>
                        <Button variant="contained" sx={{ textTransform: 'capitalize' }}>Create campaign</Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Campaigns;