import React from 'react';
import {
    Box,
} from '@mui/material';

import DMCampaignOverview from './DMCampaignOverview';
import PlayerCampaignOverview from './PlayerCampaignOverview';

const CampaignOverview = ({ isDM, campaignData, players, deadPlayers, usersCharacter, usersDeadCharacters }) => {
    return (
        <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem'>
            {isDM ? (
                <DMCampaignOverview
                    campaignData={campaignData}
                    players={players}
                    deadPlayers={deadPlayers}
                />
            ) : (
                <PlayerCampaignOverview
                    campaignData={campaignData}
                    players={players}
                    deadPlayers={deadPlayers}
                    usersCharacter={usersCharacter}
                    usersDeadCharacters={usersDeadCharacters}
                />
            )}
        </Box>
    )
}

export default CampaignOverview;