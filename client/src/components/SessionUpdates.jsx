import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import AddEditSessionUpdate from './Modals/AddEditSessionUpdate';
import { API } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSessionUpdates } from '../actions/sessionUpdateActions';
import useDebouncedPending from '../hooks/useDebouncedPending';

const SessionUpdates = () => {
    const [showAddEditSessionUpdate, setShowAddEditSessionUpdate] = useState(false);
    const [sessionUpdateId, setSessionUpdateId] = useState('');
    const [mode, setMode] = useState('add');
    const [pending, setPending] = useState(false);
    const [index, setIndex] = useState(0);

    const sessionUpdatesPending = useSelector(state => state.sessionUpdates.pending);
    const sessionUpdatesData = useSelector(state => state.sessionUpdates.data);

    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams();

    const dispatch = useDispatch();

    const handleCreateSessionUpdate = async (content) => {
        try {
            const endpoint = API.campaigns.session_updates.replaceAll('{campaignId}', id);
            await axios.post(endpoint, {
                sessionDate: new Date().toISOString(),
                content
            }, { withCredentials: true });
            enqueueSnackbar('Session update successfully published', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
        setShowAddEditSessionUpdate(false);
    }

    const handleEditSessionUpdate = (content) => {
        console.log('update content for id', sessionUpdateId);
        console.log('new content', content);
        setShowAddEditSessionUpdate(false);
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
                <Alert severity="info" sx={{ marginTop: '1rem' }}>No session updates have been published</Alert>
            )
        }

        if (!pending) {
            const sessionUpdate = sessionUpdatesData[index];
            const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(sessionUpdate.content)));
            return (
                <Stack>
                    <Stack marginBottom='.5rem' sx={{ color: '#fff' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 700 }}>SESSION DATE</Typography>
                        <Typography variant="subtitle2">{dayjs(sessionUpdate.sessionDate).format('DD/MM/YYYY')}</Typography>
                    </Stack>
                    <Card key={sessionUpdate._id} height='450px'>
                        <CardContent sx={{ height: '450px', overflow: 'auto' }}>
                            <Stack>
                                <Editor
                                    editorState={editorState}
                                    onChange={x => x}
                                    readOnly
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                    <Box display='flex' alignItems='center' justifyContent='space-between' marginTop='1rem'>
                        <Button
                            variant="contained"
                            onClick={() => setIndex(index + 1)}
                            disabled={index + 1 === sessionUpdatesData.length}
                        >
                            Previous update
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setIndex(index -1)}
                            disabled={index === 0}
                        >
                            Next update
                        </Button>
                    </Box>
                </Stack>
            )
        }
    }

    return (
        <>
            <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem' marginTop='1rem'>
                <Stack gap={2}>
                    {renderSessionUpdate()}
                    <Button
                        variant="contained"
                        onClick={() => setShowAddEditSessionUpdate(true)}
                    >
                        Post update
                    </Button>
                </Stack>
            </Box>
            <AddEditSessionUpdate
                open={showAddEditSessionUpdate}
                mode={mode}
                onClose={() => setShowAddEditSessionUpdate(false)}
                onSave={(content) => mode === 'add' ? handleCreateSessionUpdate(content) : handleEditSessionUpdate(content)}
            />
        </>
    )
}

export default SessionUpdates;