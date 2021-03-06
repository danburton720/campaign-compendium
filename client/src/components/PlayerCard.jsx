import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PreviewIcon from '@mui/icons-material/Preview';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { extraPalette } from '../themes/mui';
import CharacterCard from './CharacterCard';
import ConfirmDelete from './Modals/ConfirmDelete';
import { API } from '../config/api';
import {
    getCampaign,
} from '../actions/campaignActions';
import ViewEditCharacter from './Modals/ViewEditCharacter';

const PlayerCard = ({ player, campaignId }) => {
    const theme = useTheme();

    const [showViewCharacterModal, setShowViewCharacterModal] = useState(false);
    const [showConfirmDeleteCharacterModal, setShowConfirmDeleteCharacterModal] = useState(false);
    const [showConfirmRemovePlayerModal, setShowConfirmRemovePlayerModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleDeleteCharacter = async () => {
        const endpoint = API.characters.character.replaceAll('{characterId}', player._id);
        try {
            await axios.delete(endpoint, { withCredentials: true });
            dispatch(getCampaign(campaignId));
            enqueueSnackbar(`${player.name} has been deleted from the campaign`, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowConfirmDeleteCharacterModal(false);
    }

    const handleRemovePlayer = async () => {
        let endpoint = API.campaigns.remove_player.replaceAll('{campaignId}', campaignId);
        endpoint = endpoint.replaceAll('{userId}', player.userId);

        try {
            await axios.delete(endpoint, { withCredentials: true });
            dispatch(getCampaign(campaignId));
            enqueueSnackbar(`${player.user.displayName} has been removed from the campaign`, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowConfirmRemovePlayerModal(false);
    }

    const handleReinvitePlayer = async () => {
        const endpoint = API.campaigns.invite.replaceAll('{campaignId}', campaignId);
        try {
            await axios.post(endpoint, { email: player.user.email }, { withCredentials: true });
            dispatch(getCampaign(campaignId));
            enqueueSnackbar(`${player.user.displayName} successfully re-invited to join the campaign with a new character`, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
    }

    const handleKillOrReviveCharacter = async () => {
        try {
            if (player.status === "active") {
                const endpoint = API.characters.kill.replaceAll('{characterId}', player._id);
                await axios.post(endpoint, {}, { withCredentials: true });
                dispatch(getCampaign(campaignId));
                enqueueSnackbar(`${player.name} has been killed`, { variant: 'success' });
            } else if (player.status === "dead") {
                const endpoint = API.characters.revive.replaceAll('{characterId}', player._id);
                await axios.post(endpoint, {}, { withCredentials: true });
                dispatch(getCampaign(campaignId));
                enqueueSnackbar(`${player.name} has been revived`, { variant: 'success' });
            }
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' })
        }
    }

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
                    <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClick}>
                        <MoreVertIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                </Box>
                {player.status === "invited" ? (
                    <Alert severity="info" variant="filled">Invited to join the campaign</Alert>
                ) : (
                    <CharacterCard character={player} />
                )}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    disableScrollLock
                >
                    <MenuList>
                        {player.status !== 'invited' &&
                            <MenuItem onClick={() => setShowViewCharacterModal(true)}>
                                <ListItemIcon>
                                    <PreviewIcon/>
                                </ListItemIcon>
                                <ListItemText>View character</ListItemText>
                            </MenuItem>
                        }
                        {player.status !== 'invited' &&
                            <MenuItem onClick={() => handleKillOrReviveCharacter(player._id)}>
                                <ListItemIcon>
                                    {player.status === 'active' ? <CancelIcon/> : <AutoFixNormalIcon/>}
                                </ListItemIcon>
                                <ListItemText>{`${player.status === 'active' ? 'Kill' : 'Revive'} character`}</ListItemText>
                            </MenuItem>
                        }
                        {player.status === 'dead' &&
                            <MenuItem onClick={() => handleReinvitePlayer()}>
                                <ListItemIcon>
                                    <PersonAddAlt1Icon />
                                </ListItemIcon>
                                <ListItemText>Re-invite player</ListItemText>
                            </MenuItem>
                        }
                        {player.status !== 'invited' && <Divider/>}
                        <MenuItem
                            onClick={() => setShowConfirmDeleteCharacterModal(true)}
                        >
                            <ListItemIcon>
                                <DeleteIcon sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            <ListItemText sx={{ color: theme.palette.error.main }}>Delete character</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => setShowConfirmRemovePlayerModal(true)}
                        >
                            <ListItemIcon>
                                <DoDisturbIcon sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            <ListItemText sx={{ color: theme.palette.error.main }}>Remove player from campaign</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </CardContent>
            <ConfirmDelete
                open={showConfirmDeleteCharacterModal}
                onClose={() => setShowConfirmDeleteCharacterModal(false)}
                onConfirm={() => handleDeleteCharacter()}
                modalTitle={`Delete ${player.name}?`}
                modalSubheading={`Are you sure you want to delete this character? This action cannot be reversed.`}
            />
            <ConfirmDelete
                open={showConfirmRemovePlayerModal}
                onClose={() => setShowConfirmRemovePlayerModal(false)}
                onConfirm={() => handleRemovePlayer()}
                modalTitle={`Remove ${player.user.displayName} from the campaign?`}
                modalSubheading={`This action will delete any characters created by this player within this campaign and will remove them from the campaign. This action cannot be reversed.`}
            />
            <ViewEditCharacter
                open={showViewCharacterModal}
                onClose={() => setShowViewCharacterModal(false)}
                character={player}
                editMode={false}
            />
        </Card>
    )
}

export default PlayerCard;