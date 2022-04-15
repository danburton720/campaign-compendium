import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import PolicyIcon from '@mui/icons-material/Policy';
import axios from 'axios';

import { API } from '../config/api';
import { clearAllStorage } from '../actions/rootActions';
import { useTheme } from '@mui/material/styles';
import { ROUTES } from '../constants';
import { extraPalette } from '../themes/mui';

const AccountMenu = () => {
    const theme = useTheme();

    const currentUser = useSelector(state => state.auth.currentUser);
    const currentUserPending = useSelector(state => state.auth.currentUserPending);

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        axios.get(API.auth.logout, { withCredentials: true }).then(res => {
            if (res.data === 'done') {
                dispatch(clearAllStorage());
                navigate(ROUTES.LOGIN);
            }
        });
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ height: 60, width: 60 }}
            >
                <Avatar
                    sx={{ bgcolor: theme.palette.primary.main }}
                    src={currentUser?.image}
                    alt={`${currentUser?.firstName?.charAt(0).toUpperCase()}${currentUser?.lastName?.charAt(0).toUpperCase()}`}
                    referrerPolicy="no-referrer"
                >
                    {currentUserPending ? <CircularProgress /> : `${currentUser?.firstName?.charAt(0).toUpperCase()}${currentUser?.lastName?.charAt(0).toUpperCase()}`}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        minWidth: 200,
                        maxWidth: 400,
                        width: 'fit-content',
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 24,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box padding="6px 16px" display='flex' flexDirection='column'>
                    <Typography variant="subtitle2"
                                fontWeight={700}>{currentUser?.displayName || 'No name'}</Typography>
                    <Typography noWrap variant="subtitle2" sx={{ color: extraPalette.GREY6 }}>{currentUser?.email || 'No email'}</Typography>
                </Box>
                <Divider sx={{ margin: '8px 0' }} />
                <MenuItem onClick={() => window.open("https://www.privacypolicies.com/live/b395cb47-8727-4df3-9a6d-4ca9fc2c2341", "_blank")}>
                    <ListItemIcon>
                        <PolicyIcon fontSize="small" />
                    </ListItemIcon>
                    Privacy policy
                </MenuItem>
                <Divider sx={{ margin: '8px 0' }} />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;