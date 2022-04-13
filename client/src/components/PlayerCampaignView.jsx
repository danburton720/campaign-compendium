import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { isEmpty } from 'ramda';

import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';
import CreateCharacter from './CreateCharacter';
import CharacterCard from './CharacterCard';

const PlayerCampaignView = ({ campaignData, players, deadPlayers, usersCharacter }) => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [createCharacterMode] = useState(!isEmpty(usersCharacter) && usersCharacter.status === "invited")

    const navigate = useNavigate();

    const renderPlayers = () => {
        if (players.length > 0) {
            const charactersOtherThanCurrentUser = players.filter(character => character.userId !== currentUser._id && character.status !== 'invited');
            return (
                <Card sx={{ width: '100%', maxWidth: '400px' }}>
                    <CardContent>
                        <Typography>Other characters</Typography>
                        {charactersOtherThanCurrentUser.length > 0 ? (
                            <Box display='flex' flexDirection='column' gap={2}>
                                {charactersOtherThanCurrentUser.map(character => (
                                    <React.Fragment key={character._id}>
                                        <CharacterCard character={character}/>
                                    </React.Fragment>
                                ))}
                            </Box>
                        ) : (
                            <Alert severity="info">There are currently no other players in this campaign</Alert>
                        )}
                    </CardContent>
                </Card>
            )
        } else {
            return (
                <Box>
                    <Alert severity="info">No players have been invited to join this campaign</Alert>
                </Box>
            )
        }
    }

    const renderDeadPlayers = () => {
        if (deadPlayers.length > 0) {
            return (
                <Box display='flex' flexDirection='column'>
                    <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Player graveyard</Typography>
                    <Card sx={{ width: '100%', maxWidth: '400px' }}>
                        <CardContent>
                            {deadPlayers.length > 0 && (
                                <Box display='flex' flexDirection='column' gap={2}>
                                    {deadPlayers.map(character => (
                                        <React.Fragment key={character._id}>
                                            <CharacterCard character={character}/>
                                        </React.Fragment>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            )
        }
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
                display='flex'
                flexDirection='column'
                sx={{ overflowWrap: 'break-word' }}
            >
                <Box display='flex' marginBottom='1rem'>
                    <Typography variant="h1" sx={{ color: extraPalette.WHITE }}>{campaignData.name}</Typography>
                </Box>
                <Box display='flex' marginBottom='1rem'>
                    <Typography sx={{ color: extraPalette.WHITE }}>{campaignData.description}</Typography>
                </Box>
            </Box>
            }
            {createCharacterMode ? (
                <CreateCharacter character={usersCharacter} />
            ) : (
                !isEmpty(usersCharacter) ? (
                    <Card sx={{ width: '100%', maxWidth: '400px' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h3">My character</Typography>
                            <CharacterCard character={usersCharacter} />
                            <Button
                                variant="contained"
                            >
                                View / Edit character
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        Create character?
                    </Card>
                )

            )}
            {!createCharacterMode &&
                <>
                    <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Players</Typography>
                    {renderPlayers()}
                    {renderDeadPlayers()}
                </>
            }
        </Box>
    )
}

export default PlayerCampaignView;