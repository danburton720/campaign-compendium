import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';
import { getCampaign } from '../actions/campaignActions';
import { usePrevious } from '../hooks/usePrevious';
import PlayerCard from '../components/PlayerCard';

const ViewCampaign = () => {
    const campaignPending = useSelector(state => state.campaigns.campaignPending);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const campaignError = useSelector(state => state.campaigns.campaignError);

    const prevCampaignPending = usePrevious(campaignPending);

    const navigate = useNavigate();
    const { id } = useParams();

    const dispatch = useDispatch();

    // TODO if the logged in user is a player in the campaign, render a card containing their character information

    const getPlayers = () => {
        if (campaignData && campaignData.characters && campaignData.characters.length > 0) {
            // TODO if the logged in user is the creator, show them player cards with actions and user info
            // TODO if the logged in user is a player in the campaign, render a card with the other characters in the campaign
            return (
                <Box display='flex' sx={{ flexWrap: 'wrap' }} gap={2}>
                    {campaignData.characters.map(character => (
                        <PlayerCard player={character} />
                    ))}
                </Box>
            )
        } else {
            return (
                <Box>
                    <Alert severity="info">No players have been invited to join this campaign</Alert>
                </Box>
            )
        }
    }

    useEffect(() => {
        if (id) {
            dispatch(getCampaign(id));
        }
    }, []);

    if (campaignPending) {
        return (
            <Box minHeight='calc(100vh - 5rem - 2rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

    if (!campaignPending && prevCampaignPending && campaignError) {
        return (
            <Box minHeight='calc(100vh - 5rem - 2rem)'>
                <Alert severity="error">There was an issue fetching information for this campaign</Alert>
            </Box>
        )
    }

    return (
        <Box minHeight='calc(100vh - 5rem - 2rem)'>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                size="small"
                sx={{ marginBottom: '1rem' }}
                onClick={() => navigate(ROUTES.CAMPAIGNS)}
            >
                Go back
            </Button>
            {campaignData &&
                <Box
                    width='90%'
                    display='flex'
                    flexDirection='column'
                    sx={{ overflowWrap: 'break-word' }}
                >
                    <Typography variant="h1" sx={{ marginBottom: '1rem', color: extraPalette.WHITE }}>{campaignData.name}</Typography>
                    <Typography sx={{ marginBottom: '2rem', color: extraPalette.WHITE }}>{campaignData.description}</Typography>
                </Box>
            }
            <Typography variant="h3" sx={{ marginBottom: '1rem', color: extraPalette.WHITE }}>Players</Typography>
            {getPlayers()}
        </Box>
    )
}

export default ViewCampaign;