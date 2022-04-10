import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent, Divider,
    IconButton,
    ListItemIcon, ListItemText,
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
import axios from 'axios';
import { useSnackbar } from 'notistack';

import { extraPalette } from '../themes/mui';
import CharacterCard from './CharacterCard';
import ConfirmDelete from './Modals/ConfirmDelete';
import { API } from '../config/api';
import { getCampaign } from '../actions/campaignActions';

const PlayerCard = ({ player, campaignId }) => {
    const theme = useTheme();

    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [selectedPlayerName, setSelectedPlayerName] = useState('');
    const [showCharacterModal, setShowCharacterModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
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

    const handleRemovePlayer = async () => {
        console.log('delete player id', selectedPlayerId);
        const endpoint = API.characters.character.replaceAll('{characterId}',selectedPlayerId);
        try {
            await axios.delete(endpoint, { withCredentials: true });
            dispatch(getCampaign(campaignId));
            enqueueSnackbar(`${selectedPlayerName} has been removed from the campaign`, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowConfirmDeleteModal(false);
    }

    const handleKillOrReviveCharacter = () => {
        console.log('kill or revive the character');
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
                >
                    <MenuList>
                        <MenuItem onClick={() => setShowCharacterModal(true)}>
                            <ListItemIcon>
                                <PreviewIcon />
                            </ListItemIcon>
                            <ListItemText>View character</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleKillOrReviveCharacter()}>
                            <ListItemIcon>
                                {player.status === 'active' ? <CancelIcon /> : <AutoFixNormalIcon /> }
                            </ListItemIcon>
                            <ListItemText>{`${player.status === 'active' ? 'Kill' : 'Revive'} character`}</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                setSelectedPlayerId(player._id);
                                setSelectedPlayerName(player.user.displayName);
                                setShowConfirmDeleteModal(true);
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon sx={{ color: theme.palette.error.main }} />
                            </ListItemIcon>
                            <ListItemText sx={{ color: theme.palette.error.main }}>Remove player from campaign</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </CardContent>
            <ConfirmDelete
                open={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={() => handleRemovePlayer()}
                modalTitle={`Remove ${selectedPlayerName} from the campaign?`}
                modalSubheading={`This will delete any character information set by the player and remove them from the campaign. This action cannot be reversed.`}
            />
        </Card>
    )
}

export default PlayerCard;