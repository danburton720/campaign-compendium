import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';

const Campaigns = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);

    const navigate = useNavigate();

    if (currentUserPending) {
        return (
            <Box display='flex' width='100%' height='100vh'>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Typography variant="h1" sx={{ fontWeight: 400, color: extraPalette.WHITE }}>Hello, <strong>{currentUser.firstName}</strong></Typography>
            <Box display="flex" flexDirection="column" marginTop='2rem'>
                <Typography variant="h3" sx={{ marginBottom: '1rem', color: extraPalette.WHITE }}>My campaigns</Typography>
                <Card sx={{ height: '300px', width: '350px', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h3">Start a new campaign</Typography>
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
                        >
                            Create campaign
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Campaigns;