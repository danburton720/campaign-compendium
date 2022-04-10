import React from 'react';
import { Alert, Avatar, Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { extraPalette } from '../themes/mui';
import CharacterCard from './CharacterCard';

const PlayerCard = ({ player }) => {
    const theme = useTheme();

    return (
        <Card sx={{ width: '100%', maxWidth: '350px' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column'}}>
                <Box display='flex' marginBottom='1rem'>
                    <Avatar
                        sx={{ bgcolor: theme.palette.primary.main }}
                        src={player.user.image}
                        alt={`${player.user.firstName?.charAt(0).toUpperCase()}${player.user.lastName?.charAt(0).toUpperCase()}`}
                        referrerPolicy="no-referrer"
                    >
                        {`${player.user.firstName?.charAt(0).toUpperCase()}${player.user.lastName?.charAt(0).toUpperCase()}`}
                    </Avatar>
                    <Box display='flex' flexDirection='column' marginLeft='1rem' justifyContent='center' maxWidth='210px'>
                        <Typography noWrap sx={{ fontWeight: 500, lineHeight: '16px' }}>{player.user.displayName}</Typography>
                        <Typography noWrap variant="subtitle2" sx={{ color: extraPalette.GREY6 }}>{player.user.email}</Typography>
                    </Box>
                    <IconButton sx={{ marginLeft: 'auto' }}>
                        <MoreVertIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                </Box>
                {player.status === "invited" ? (
                    <Alert severity="info" variant="filled">Invited to join the campaign</Alert>
                ) : (
                    <CharacterCard character={player} />
                )}
            </CardContent>
        </Card>
    )
}

export default PlayerCard;