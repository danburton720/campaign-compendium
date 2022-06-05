import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CampaignCard from './CampaignCard';
import { ROUTES } from '../constants';
import useDebouncedPending from '../hooks/useDebouncedPending';
import { extraPalette } from '../themes/mui';

const CreatedCampaigns = () => {
    const campaignsPending = useSelector(state => state.campaigns.campaignsPending);
    const createdCampaigns = useSelector(state => state.campaigns.createdCampaigns);
    const [pending, setPending] = useState(false);

    const navigate = useNavigate();

    useDebouncedPending(setPending, [campaignsPending]);

    return (
        <>
            <Typography variant="h3" sx={{ marginBottom: '1rem', color: extraPalette.WHITE }}>
                Campaigns I've created
            </Typography>
            {pending ? (
                <Box
                    display='flex'
                    height='200px'
                    width='100%'
                    justifyContent='center'
                    alignItems='center'
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box display="flex" flexWrap='wrap' gap={3}>
                    {createdCampaigns?.map(campaign => (
                        <React.Fragment key={campaign._id}>
                            <CampaignCard
                                campaign={campaign}
                                buttonText='Continue campaign'
                                onButtonClick={() => navigate(`/campaigns/${campaign._id}`)}
                            />
                        </React.Fragment>
                    ))}
                    <Card sx={{ height: '300px', width: '350px', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                        <CardContent sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box />
                            <Typography variant="h3">Start a new campaign</Typography>
                            <Button
                                variant="contained"
                                sx={{ justifySelf: 'flex-end', width: '100%' }}
                                onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
                            >
                                Create campaign
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </>
    );
};

export default CreatedCampaigns;