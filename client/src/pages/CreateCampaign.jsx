import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Chip, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';

import { extraPalette } from '../themes/mui';
import { ROUTES } from '../constants';
import { API } from '../config/api';

const CreateCampaign = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [invitedPlayers, setInvitedPlayers] = useState([]);

    const handleAddPlayer = () => {
        setInvitedPlayers([ ...invitedPlayers, email ]);
        setEmail('');
    }

    const handleRemovePlayer = playerToRemove => {
        setInvitedPlayers(invitedPlayers.filter(player => player !== playerToRemove));
    }

    const handleCreateCampaign = async () => {
        try {
            await axios.post(API.campaigns.campaigns, {
                name,
                description,
                invitedUsers: invitedPlayers
            }, { withCredentials: true });
            console.log('post successful')
            console.log('send a notification')
            navigate(ROUTES.CAMPAIGNS);
        } catch (err) {
            console.log('send a notification that the post was unsuccessful')
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Box height='100%'>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                size="small"
                sx={{ marginBottom: '1rem' }}
                onClick={() => navigate(ROUTES.CAMPAIGNS)}
            >
                Go back
            </Button>
            <Typography variant="h1" sx={{ marginBottom: '2rem', color: extraPalette.WHITE }}>Create a campaign</Typography>
            <Box
                display="flex"
                flexDirection="column"
                gap={3}
            >
                <Card>
                    <CardContent>
                        <TextField
                            required
                            id='campaign-name'
                            label='Campaign name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                            sx={{
                                width: '100%',
                                maxWidth: '340px',
                                marginBottom: '1rem'
                            }}
                        />
                        <TextField
                            required
                            id='campaign-description'
                            label='Campaign description'
                            multiline
                            fullWidth
                            rows={8}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        <Box display="flex" flexDirection="column" width="100%" maxWidth="340px">
                            <Typography variant="h4">Add players <span style={{ fontWeight: 400, color: extraPalette.GREY6 }}>(or skip for now)</span></Typography>
                            <Alert severity="info" sx={{ marginTop: '1rem' }}>The user must already exist in the system to gain access</Alert>
                            <TextField
                                id='email-address'
                                label='Email address'
                                fullWidth
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                sx={{ margin: '1rem 0'}}
                                error={invitedPlayers.includes(email)}
                                helperText={invitedPlayers.includes(email) ? 'Email has already been added' : ''}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleAddPlayer()}
                                disabled={invitedPlayers.includes(email) || !isEmail(email)}
                            >
                                Add player
                            </Button>
                        </Box>
                        <Box display="flex" flexDirection="column" flex={1}>
                            <Typography variant="h4">Players to be invited</Typography>
                            <Box width='100%' height='100%' display="flex" flexWrap='wrap' gap={2} sx={{marginTop: '1rem'}}>
                                {invitedPlayers.length > 0 ? invitedPlayers.map((player, key) => (
                                    <Chip color="primary" key={key} label={player} onDelete={() => handleRemovePlayer(player)} />
                                )) : <Alert severity="info" sx={{ height: '100%', width: '100%' }}>No players have been added, try adding one!</Alert>}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Button
                    variant="contained"
                    sx={{ marginBottom: '2rem', justifySelf: 'flex-start', width: '100%', maxWidth: '340px' }}
                    disabled={!name || !description}
                    onClick={() => handleCreateCampaign()}
                >
                    Create campaign
                </Button>
            </Box>
        </Box>
    )
}

export default CreateCampaign;