import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton, Paper, TextField,
    Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { isEmpty } from 'ramda';
import isEmail from 'validator/lib/isEmail';
import { useSnackbar } from 'notistack';

import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';
import { getCampaign, updateCampaignDescription, updateCampaignName } from '../actions/campaignActions';
import { usePrevious } from '../hooks/usePrevious';
import PlayerCard from '../components/PlayerCard';
import { API } from '../config/api';
import CharacterCard from '../components/CharacterCard';
import EditCard from '../components/EditCard';
import CreateCharacter from '../components/CreateCharacter';
import useDebouncedPending from '../hooks/useDebouncedPending';

const ViewCampaign = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignPending = useSelector(state => state.campaigns.campaignPending);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const campaignError = useSelector(state => state.campaigns.campaignError);

    const [isDM, setIsDM] = useState(campaignData?.createdBy === currentUser?._id);
    const [usersCharacter, setUsersCharacter] = useState(() =>
        campaignData?.characters?.find(character => character?._id === currentUser?._id) || {}
    );
    const [editNameMode, setEditNameMode] = useState(false);
    const [editDescriptionMode, setEditDescriptionMode] = useState(false);
    const [name, setName] = useState(campaignData?.name);
    const [description, setDescription] = useState(campaignData?.name);
    const [pending, setPending] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [players, setPlayers] = useState(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
    const [deadPlayers, setDeadPlayers] = useState(campaignData?.characters?.filter(character => character.status === 'dead') || []);

    const prevCampaignPending = usePrevious(campaignPending);

    const navigate = useNavigate();
    const { id } = useParams();

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const getPlayers = () => {
        if (players.length > 0) {
            if (isDM) {
                return (
                    <Box display='flex' sx={{ flexWrap: 'wrap' }} gap={2}>
                        {players.map(character => (
                            <React.Fragment key={character._id}>
                                <PlayerCard player={character} campaignId={campaignData._id} />
                            </React.Fragment>
                        ))}
                    </Box>
                )
            }
            // this will run for players, as the DM will get the PlayerCard returned above
            const charactersOtherThanCurrentUser = players.filter(character => character.userId !== currentUser._id);
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

    const getDeadPlayers = () => {
        if (deadPlayers.length > 0) {
            if (isDM) {
                return (
                    <Box display='flex' flexDirection='column'>
                        <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Player graveyard</Typography>
                        <Box display='flex' sx={{ flexWrap: 'wrap' }} gap={2}>
                            {deadPlayers.map(character => (
                                <React.Fragment key={character._id}>
                                    <PlayerCard player={character} campaignId={campaignData._id} />
                                </React.Fragment>
                            ))}
                        </Box>
                    </Box>
                )
            }
            // this will run for players, as the DM will get the PlayerCard returned above
            const charactersOtherThanCurrentUser = deadPlayers.filter(character => character.userId !== currentUser._id);
            return (
                <Box display='flex' flexDirection='column'>
                    <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Player graveyard</Typography>
                    <Card sx={{ width: '100%', maxWidth: '400px' }}>
                        <CardContent>
                            {charactersOtherThanCurrentUser.length > 0 && (
                                <Box display='flex' flexDirection='column' gap={2}>
                                    {charactersOtherThanCurrentUser.map(character => (
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

    const handleSaveName = async () => {
        const endpoint = API.campaigns.campaign.replaceAll('{campaignId}', id);
        try {
            await axios.patch(endpoint, { name }, { withCredentials: true });
            dispatch(updateCampaignName(name));
            enqueueSnackbar('Campaign name successfully changed', { variant: 'success' });
            setEditNameMode(false);
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
            // reset name to name from server
            // setName(campaignData?.name);
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
            // reset description to name from server
            // setDescription(campaignData?.description);
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

    useEffect(() => {
        if (id) {
            dispatch(getCampaign(id));
        }
    }, []);

    useEffect(() => {
        if (!campaignPending && prevCampaignPending && campaignData) {
            setName(campaignData.name);
            setDescription(campaignData.description)
            setIsDM(campaignData?.createdBy === currentUser._id || false);
            setUsersCharacter(campaignData?.characters?.find(character => character?.userId === currentUser?._id) || {});
            setPlayers(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
            console.log('campaignData', campaignData)
            setDeadPlayers(campaignData?.characters?.filter(character => character.status === 'dead') || []);
        }
    }, [campaignPending, prevCampaignPending]);


    useDebouncedPending(setPending, [campaignPending]);

    if (pending) {
        return (
            <Box minHeight='calc(100vh - 5rem - 2rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

    if (!campaignPending && prevCampaignPending) {
        if (campaignError || isEmpty(campaignData)) {
            return (
                <Box minHeight='calc(100vh - 5rem - 2rem)'>
                    <Alert severity="error">There was an issue fetching information for this campaign</Alert>
                </Box>
            )
        }
        if (!isDM && isEmpty(usersCharacter)) {
            return (
                <Box minHeight='calc(100vh - 5rem - 2rem)'>
                    <Alert severity="error">Oh dear, it seems you don't have access to this campaign!</Alert>
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
                            {isDM &&
                            <IconButton sx={{ marginTop: '-.5rem' }} onClick={() => setEditNameMode(true)}>
                                <EditIcon sx={{ color: '#fff' }} />
                            </IconButton>
                            }
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
                            {isDM &&
                            <IconButton sx={{ marginTop: '-.5rem' }} onClick={() => setEditDescriptionMode(true)}>
                                <EditIcon sx={{ color: '#fff' }}/>
                            </IconButton>
                            }
                        </>
                    )}
                </Box>
            </Box>
            }
            {!isDM && !isEmpty(usersCharacter) && usersCharacter.status === "invited" ? (
                <CreateCharacter character={usersCharacter} />
            ) : (
                !isDM && !isEmpty(usersCharacter) &&
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
            )}
            {(isDM || (!isEmpty(usersCharacter) && usersCharacter.status !== "invited")) &&
                <>
                    <Typography variant="h3" sx={{ margin: '1rem 0', color: extraPalette.WHITE }}>Players</Typography>
                    {getPlayers()}
                </>
            }
            {isDM &&
                <Paper sx={{ marginTop: '2rem', padding: '1rem', width: '100%', maxWidth: '350px' }}>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <Typography variant="h4" sx={{ fontWeight: 500 }}>Invite another player</Typography>
                        <TextField
                            label='Invite player'
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            error={inviteEmail && !isEmail(inviteEmail)}
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
            }
            {(isDM || (!isEmpty(usersCharacter) && usersCharacter.status !== "invited")) &&
                <>
                    {getDeadPlayers()}
                </>
            }
        </Box>
    )
}

export default ViewCampaign;