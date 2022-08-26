import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
// import { convertFromRaw, Editor, EditorState } from 'draft-js';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import AddEditSessionUpdate from './Modals/AddEditSessionUpdate';
import { API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSessionUpdates } from '../actions/sessionUpdateActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import { useTheme } from '@mui/material/styles';
import ConfirmDelete from './Modals/ConfirmDelete';
import { ROUTES } from '../constants';

const SessionUpdates = () => {
    const sessionUpdatesPending = useSelector(state => state.sessionUpdates.pending);
    const sessionUpdatesData = useSelector(state => state.sessionUpdates.data);
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignData = useSelector(state => state.campaigns.campaignData);

    const [showAddEditSessionUpdate, setShowAddEditSessionUpdate] = useState(false);
    const [sessionUpdateId, setSessionUpdateId] = useState('');
    const [sessionUpdateDate, setSessionUpdateDate] = useState('');
    const [mode, setMode] = useState('add');
    const [currentContent, setCurrentContent] = useState('');
    const [currentDate, setCurrentDate] = useState(undefined);
    const [pending, setPending] = useState(false);
    const [index, setIndex] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const isDM = campaignData?.createdBy === currentUser?._id;

    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme();

    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleCreateSessionUpdate = async (sessionDate, content) => {
        try {
            const endpoint = API.campaigns.session_updates.replaceAll('{campaignId}', id);
            await axios.post(endpoint, {
                sessionDate,
                content
            }, { withCredentials: true });
            enqueueSnackbar('Session update successfully published', { variant: 'success' });
            dispatch(getAllSessionUpdates(id));
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowAddEditSessionUpdate(false);
    }

    const handleEditSessionUpdate = async (sessionDate, content) => {
        try {
            const endpoint = API.session_updates.session_update.replaceAll('{sessionUpdateId}', sessionUpdateId);
            await axios.patch(endpoint, {
                sessionDate,
                content
            }, { withCredentials: true });
            enqueueSnackbar('Session update successfully edited', { variant: 'success' });
            dispatch(getAllSessionUpdates(id));
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowAddEditSessionUpdate(false);
    }

    const handleDeleteSessionUpdate = async () => {
        try {
            const endpoint = API.session_updates.session_update.replaceAll('{sessionUpdateId}', sessionUpdateId);
            await axios.delete(endpoint, { withCredentials: true });
            enqueueSnackbar('Session update successfully deleted', { variant: 'success' });
            dispatch(getAllSessionUpdates(id));
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowConfirmDeleteModal(false);
    }

    useEffect(() => {
        dispatch(getAllSessionUpdates(id));
    }, []);

    useDebouncedPending(setPending, [sessionUpdatesPending]);

    if (pending) {
        return (
            <Box minHeight='calc(100vh - 7rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

    const renderSessionUpdate = () => {
        if (!pending && sessionUpdatesData.length === 0) {
            return (
                <Stack>
                    <Alert severity="info" sx={{ marginTop: '1rem' }}>No session updates have been published</Alert>
                    {isDM &&
                        <Button
                            variant="contained"
                            onClick={() => {
                                setCurrentContent('');
                                setMode('add');
                                setShowAddEditSessionUpdate(true);
                            }}
                            sx={{
                                marginTop: '1rem',
                                marginLeft: 'auto'
                            }}
                            startIcon={<AddIcon/>}
                        >
                            Publish a new update
                        </Button>
                    }
                </Stack>
            )
        }

        if (!pending) {
            const sessionUpdate = sessionUpdatesData[index];
            // const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(sessionUpdate.content)));
            return (
                <>
                    <Box display='flex' alignItems='center' marginBottom='.5rem'>
                        <Stack justifySelf='flex-start' sx={{ color: '#fff' }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 700 }}>SESSION DATE</Typography>
                            <Typography variant="subtitle2">{dayjs(sessionUpdate.sessionDate).format('DD/MM/YYYY')}</Typography>
                        </Stack>
                        {isDM &&
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setCurrentContent('');
                                    setMode('add');
                                    setShowAddEditSessionUpdate(true);
                                }}
                                sx={{
                                    maxWidth: '300px',
                                    marginLeft: 'auto'
                                }}
                                startIcon={<AddIcon/>}
                            >
                                Publish a new update
                            </Button>
                        }
                    </Box>
                    <Card key={sessionUpdate._id} height='62vh'>
                        <CardContent sx={{ height: '62vh', overflow: 'auto' }}>
                            <Stack>
                                {isDM &&
                                    <Box
                                        display='flex'
                                    >
                                        <IconButton aria-label="options" onClick={handleClick} sx={{ marginLeft: 'auto' }}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    </Box>
                                }
                                <Typography
                                    sx={{
                                        width: '100%',
                                        wordWrap: 'break-word',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {sessionUpdate.content}
                                </Typography>
                                {/*<Editor*/}
                                {/*    editorState={editorState}*/}
                                {/*    onChange={x => x}*/}
                                {/*    readOnly*/}
                                {/*/>*/}
                            </Stack>
                        </CardContent>
                    </Card>
                    <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='1rem'>
                        <Button
                            variant="contained"
                            onClick={() => setIndex(index + 1)}
                            disabled={index + 1 === sessionUpdatesData.length}
                            startIcon={<ArrowBackIcon />}
                        >
                            Previous update
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setIndex(index -1)}
                            disabled={index === 0}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Next update
                        </Button>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="session-update-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        disableScrollLock
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                minWidth: 200,
                                maxWidth: 300,
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
                                    right: 14,
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
                        <MenuItem
                            onClick={() => {
                                setCurrentContent(sessionUpdate.content);
                                setCurrentDate(sessionUpdate.sessionDate)
                                setSessionUpdateId(sessionUpdate._id);
                                setMode('edit');
                                setShowAddEditSessionUpdate(true);
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setSessionUpdateId(sessionUpdate._id);
                                setSessionUpdateDate(sessionUpdate.sessionDate);
                                setShowConfirmDeleteModal(true);
                            }}
                            sx={{
                                color: theme.palette.error.main,
                                '& .MuiListItemIcon-root': {
                                    color: 'inherit'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            )
        }
    }

    return (
        <>
            <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem' marginTop='1rem'>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="contained"
                    size="small"
                    sx={{ marginBottom: '1rem' }}
                    onClick={() => navigate(ROUTES.CAMPAIGNS)}
                >
                    Go back
                </Button>
                <Stack gap={2}>
                    {renderSessionUpdate()}
                </Stack>
            </Box>
            <AddEditSessionUpdate
                open={showAddEditSessionUpdate}
                mode={mode}
                onClose={() => setShowAddEditSessionUpdate(false)}
                onSave={(sessionDate, content) => mode === 'add' ? handleCreateSessionUpdate(sessionDate, content) : handleEditSessionUpdate(sessionDate, content)}
                currentContent={currentContent}
                currentDate={currentDate}
            />
            <ConfirmDelete
                open={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={() => handleDeleteSessionUpdate()}
                modalTitle={`Delete session update for ${dayjs(sessionUpdateDate).format('DD/MM/YYYY')}?`}
                modalSubheading={`Are you sure you want to delete this session update? This action cannot be reversed.`}
            />
        </>
    )
}

export default SessionUpdates;