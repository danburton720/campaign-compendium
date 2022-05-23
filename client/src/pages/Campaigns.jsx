import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

import { extraPalette } from '../themes/mui';
import { getAllCampaigns } from '../actions/campaignActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import CreatedCampaigns from '../components/CreatedCampaigns';
import PlayingCampaigns from '../components/PlayingCampaigns';
import InvitedCampaigns from '../components/InvitedCampaigns';

const Campaigns = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);

    const [loginPending, setLoginPending] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCampaigns());
    }, []);

    useDebouncedPending(setLoginPending, [currentUserPending]);

    if (loginPending) {
        return (
            <Box
                minHeight='calc(100vh - 7rem)'
                display='flex'
                alignItems='center'
                justifyContent='center'
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box minHeight='calc(100vh - 7rem)'>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 400,
                    color: extraPalette.WHITE
                }}
            >
                <span>Hello, <strong>{currentUser.firstName}</strong></span>
            </Typography>
            <Box display="flex" flexDirection="column" marginTop='2rem'>
                <CreatedCampaigns />
                <PlayingCampaigns />
                <InvitedCampaigns />
            </Box>
        </Box>
    );
};

export default Campaigns;