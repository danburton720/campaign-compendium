import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Skeleton, Typography } from '@mui/material';

import { extraPalette } from '../themes/mui';
import { getAllCampaigns } from '../actions/campaignActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import CreatedCampaigns from '../components/CreatedCampaigns';
import PlayingCampaigns from '../components/PlayingCampaigns';
import InvitedCampaigns from '../components/InvitedCampaigns';

const Campaigns = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignsPending = useSelector(state => state.campaigns.campaignsPending);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);

    const [pending, setPending] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCampaigns());
    }, []);

    useDebouncedPending(setPending, [currentUserPending, campaignsPending]);

    return (
        <Box minHeight='calc(100vh - 5rem - 2rem)'>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 400,
                    color: extraPalette.WHITE
                }}
            >
                {pending ? <Skeleton width='70vw' sx={{ bgcolor: '#166260' }} /> :  <span>Hello, <strong>{currentUser.firstName}</strong></span>}
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