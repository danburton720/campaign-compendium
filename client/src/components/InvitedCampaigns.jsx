import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';

import CampaignCard from './CampaignCard';
import useDebouncedPending from '../hooks/useDebouncedPending';
import { extraPalette } from '../themes/mui';

const InvitedCampaigns = () => {
    const campaignsPending = useSelector(state => state.campaigns.campaignsPending);
    const playerCampaigns = useSelector(state => state.campaigns.playerCampaigns);

    const [pending, setPending] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const navigate = useNavigate();

    useDebouncedPending(setPending, [campaignsPending]);

    useEffect(() => {
        if (playerCampaigns) {
            const campaignList = [];

            playerCampaigns.forEach(campaign => {
                const activeCharacters = campaign.characters.filter(character => character.status === "active");
                const deadCharacters = campaign.characters.filter(character => character.status === "dead");
                const invitedCharacters = campaign.characters.filter(character => character.status === "invited");
                console.log('activeCharacters', activeCharacters)
                console.log('deadCharacters', deadCharacters)
                console.log('invitedCharacters', invitedCharacters)
                if (invitedCharacters.length === 1 && activeCharacters.length === 0 && deadCharacters.length === 0) campaignList.push(campaign);
            });

            setCampaigns(campaignList);
        }
    }, [playerCampaigns]);

    return (
        <>
            <Typography variant="h3" sx={{ marginBottom: '1rem', marginTop: '2rem', color: extraPalette.WHITE }}>
                Campaigns I'm invited to
            </Typography>
            {pending ? (
                <Box display='flex' height='200px' width='100%' justifyContent='center' alignItems='center'>
                    <CircularProgress />
                </Box>
            ) : (
                <Box display="flex" flexWrap='wrap' gap={3}>
                    {campaigns.map(campaign => (
                        <React.Fragment key={campaign._id}>
                            <CampaignCard
                                campaign={campaign}
                                buttonText='Join campaign'
                                onButtonClick={() => navigate(`/campaigns/${campaign._id}`)}
                            />
                        </React.Fragment>
                    ))}
                    {campaigns.length === 0 &&
                    <Alert severity="info">Looks like you aren't playing in any campaigns right now</Alert>
                    }
                </Box>
            )}
        </>
    );
};

export default InvitedCampaigns;