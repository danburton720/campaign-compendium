import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import isEmail from 'validator/lib/isEmail';
import { useSnackbar } from 'notistack';
import axios from 'axios';

import { ROUTES } from '../constants';
import EditCard from './EditCard';
import { extraPalette } from '../themes/mui';
import { API } from '../config/api';
import { getCampaign, updateCampaignDescription, updateCampaignName } from '../actions/campaignActions';
import PlayerCard from './PlayerCard';

const DMCampaignView = ({ campaignData, players, deadPlayers }) => {
    const [editNameMode, setEditNameMode] = useState(false);
    const [editDescriptionMode, setEditDescriptionMode] = useState(false);
    const [name, setName] = useState(campaignData?.name);
    const [description, setDescription] = useState(campaignData?.name);
    const [inviteEmail, setInviteEmail] = useState('');

    const navigate = useNavigate();

    const { id } = useParams();

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const handleSaveName = async () => {
        const endpoint = API.campaigns.campaign.replaceAll('{campaignId}', id);
        try {
            await axios.patch(endpoint, { name }, { withCredentials: true });
            dispatch(updateCampaignName(name));
            enqueueSnackbar('Campaign name successfully changed', { variant: 'success' });
            setEditNameMode(false);
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
    }

    const handleSaveDescription = async () => {
        const endpoint = API.campaigns.campaign.replaceAll('{campaignId}', id);
        try {
            await axios.patch(endpoint, { description }, { withCredentials: true });
            dispatch(updateCampaignDescription(description));
            enqueueSnackbar('Campaign description successfully changed', { variant: 'success' });
            setEditDescriptionMode(false);
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
    }

    const handleInviteUser = async () => {
        const endpoint = API.campaigns.invite.replaceAll('{campaignId}', id);
        try {
            await axios.post(endpoint, { email: inviteEmail }, { withCredentials: true });
            dispatch(getCampaign(id));
            enqueueSnackbar('User successfully invited to join the campaign', { variant: 'success' });
            setInviteEmail('');
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
    }

    const getPlayers = () => {
        if (players?.length > 0) {
            return (
                <Box display='flex' sx={{ flexWrap: 'wrap' }} gap={2}>
                    {players?.map(character => (
                        <React.Fragment key={character._id}>
                            <PlayerCard player={character} campaignId={campaignData._id} />
                        </React.Fragment>
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

    const getDeadPlayers = () => {
        if (deadPlayers?.length > 0) {
            return (
                <Box display='flex' flexDirection='column' marginTop='1rem'>
                    <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Player graveyard</Typography>
                    <Box display='flex' sx={{ flexWrap: 'wrap' }} gap={2}>
                        {deadPlayers?.map(character => (
                            <React.Fragment key={character._id}>
                                <PlayerCard player={character} campaignId={campaignData._id} />
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            )
        }
    }

    return (
        <Box minHeight='calc(100vh - 7rem)'>
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
                        {editNameMode ? (
                            <EditCard
                                value={name}
                                valueSetter={setName}
                                modeSetter={setEditNameMode}
                                onSave={handleSaveName}
                                label='Campaign name'
                                helperText='Name required'
                                limit={100}
                            />
                        ) : (
                            <>
                                <Typography variant="h1" sx={{ color: extraPalette.WHITE }}>{campaignData.name}</Typography>
                                <IconButton sx={{ marginTop: '-.5rem' }} onClick={() => setEditNameMode(true)}>
                                    <EditIcon sx={{ color: '#fff' }} />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    <Box display='flex' marginBottom='1rem'>
                        {editDescriptionMode ? (
                            <EditCard
                                value={description}
                                valueSetter={setDescription}
                                modeSetter={setEditDescriptionMode}
                                onSave={handleSaveDescription}
                                label='Campaign description'
                                helperText='Description required'
                                limit={10000}
                                multiline
                            />
                        ) : (
                            <>
                                <Typography sx={{ color: extraPalette.WHITE }}>{campaignData.description}</Typography>
                                <IconButton sx={{ marginTop: '-.5rem' }} onClick={() => setEditDescriptionMode(true)}>
                                    <EditIcon sx={{ color: '#fff' }}/>
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Box>
            }
            <>
                <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Players</Typography>
                {getPlayers()}
            </>
            <Paper sx={{ marginTop: '2rem', padding: '1rem', width: '100%', maxWidth: '350px' }}>
                <Box display='flex' flexDirection='column' gap={2}>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>Invite another player</Typography>
                    <TextField
                        id='invite-player-email'
                        type='email'
                        label='Invite player'
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        error={!!(inviteEmail && !isEmail(inviteEmail))}
                        helperText={inviteEmail && !isEmail(inviteEmail) ? 'Must be a valid email': ' '}
                    />
                    <Button
                        variant="contained"
                        disabled={!inviteEmail || !isEmail(inviteEmail)}
                        onClick={() => handleInviteUser()}
                    >
                        Invite player
                    </Button>
                </Box>
            </Paper>
            <>
                {getDeadPlayers()}
            </>
        </Box>
    )
}

export default DMCampaignView;