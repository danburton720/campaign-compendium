import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';

import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';
import { getAllCampaigns } from '../actions/campaignActions';

const Campaigns = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);
    const campaignsPending = useSelector(state => state.campaigns.campaignsPending);
    const createdCampaigns = useSelector(state => state.campaigns.createdCampaigns);
    const playerCampaigns = useSelector(
        state => state.campaigns.playerCampaigns.filter(
            campaign => campaign.character.status === 'active'
        )
    );
    const invitedCampaigns = useSelector(
        state => state.campaigns.playerCampaigns.filter(
            campaign => campaign.character.status === 'invited'
        )
    );

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCampaigns());
    }, []);

    if (currentUserPending || campaignsPending) {
        return (
            <Box display='flex' width='100%' height='100vh'>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box minHeight='calc(100vh - 5rem - 2rem)'>
            <Typography variant="h1" sx={{
                fontWeight: 400,
                color: extraPalette.WHITE
            }}>Hello, <strong>{currentUser.firstName}</strong></Typography>
            <Box display="flex" flexDirection="column" marginTop='2rem'>
                <Typography variant="h3" sx={{ marginBottom: '1rem', color: extraPalette.WHITE }}>My
                    campaigns</Typography>
                <Box display="flex" flexWrap='wrap' gap={3}>
                    {createdCampaigns.map(campaign => (
                        <Card key={campaign._id} sx={{ height: '300px', width: '350px' }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <Box height='100%' display='flex' flexDirection='column'>
                                    <Typography variant="h3">{campaign.name}</Typography>
                                    <Box
                                        marginTop='1rem'
                                        style={{
                                            maxWidth: '100%',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 6,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        <Typography variant="body2">{campaign.description}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        justifySelf: 'flex-end'
                                    }}
                                    onClick={() => navigate(`/campaigns/${campaign._id}`)}
                                >
                                    Continue campaign
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Card sx={{ height: '100px', width: '350px', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
                        <CardContent sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
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

                <Typography variant="h3" sx={{ marginBottom: '1rem', marginTop: '2rem', color: extraPalette.WHITE }}>Campaigns
                    I'm playing</Typography>
                <Box display="flex" flexWrap='wrap' gap={3}>
                    {playerCampaigns.map(campaign => (
                        <Card key={campaign._id} sx={{ height: '300px', width: '350px' }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <Box height='100%' display='flex' flexDirection='column'>
                                    <Typography variant="h3">{campaign.name}</Typography>
                                    <Box
                                        marginTop='1rem'
                                        style={{
                                            maxWidth: '100%',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 6,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        <Typography variant="body2">{campaign.description}</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        justifySelf: 'flex-end'
                                    }}
                                    onClick={() => navigate(`/campaigns/${campaign._id}`)}
                                >
                                    Continue campaign
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {playerCampaigns.length === 0 &&
                        <Alert severity="info">Looks like you aren't playing in any campaigns right now</Alert>
                    }
                </Box>

                <Typography variant="h3" sx={{ marginBottom: '1rem', marginTop: '2rem', color: extraPalette.WHITE }}>Campaigns
                    I'm invited to</Typography>
                <Box display="flex" flexWrap='wrap' gap={3}>
                    {invitedCampaigns.map(campaign => (
                        <Card key={campaign._id} sx={{ height: '300px', width: '350px' }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                justifyContent: 'space-between'
                            }}>
                                <Box height='100%' display='flex' flexDirection='column'>
                                    <Typography variant="h3">{campaign.name}</Typography>
                                    <Box
                                        marginTop='1rem'
                                        style={{
                                            maxWidth: '100%',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 6,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        <Typography variant="body2">{campaign.description}</Typography>
                                    </Box>
                                </Box>
                                <Button variant="contained" sx={{ justifySelf: 'flex-end' }}>Join campaign</Button>
                            </CardContent>
                        </Card>
                    ))}
                    {invitedCampaigns.length === 0 &&
                        <Alert severity="info">Looks like you haven't been invited to join any campaigns</Alert>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default Campaigns;