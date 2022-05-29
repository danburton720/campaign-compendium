import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import 'draft-js/dist/Draft.css';

import { usePrevious } from '../../hooks/usePrevious';
import WysiwygButtonGroup from '../UI/WysiwygButtonGroup';
import { API } from '../../config/api';
import { useParams } from 'react-router-dom';

const AddEditSessionUpdate = ({ open, mode, onClose, onSave, currentContent }) => {
    const [editorState, setEditorState] = useState(currentContent ? convertFromRaw(JSON.parse(currentContent)) : EditorState.createEmpty());

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const prevOpen = usePrevious(open);

    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams();

    const handleKeyCommand = (command, editorState) => {
        let newState = RichUtils.handleKeyCommand(editorState, command);

        if (['bold', 'underline', 'italic'].includes(command)) {
            newState = RichUtils.toggleInlineStyle(editorState, command.toUpperCase());
        }

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    const handleCreateSessionUpdate = async () => {
        try {
            const contentState = editorState.getCurrentContent();
            const endpoint = API.campaigns.session_updates.replaceAll('{campaignId}', id);
            await axios.post(endpoint, {
                sessionDate: new Date().toISOString(),
                content: convertToRaw(contentState)
            }, { withCredentials: true });
            enqueueSnackbar('Campaign successfully created', { variant: 'success' });
            onSave();
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
            onSave();
        }
    }

    useEffect(() => {
        if (open && !prevOpen) {
            setEditorState(currentContent ? convertFromRaw(JSON.parse(currentContent)) : EditorState.createEmpty());
        }
    }, [open, prevOpen]);

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        console.log('editorState', editorState);
        console.log('editorState to raw', convertToRaw(contentState))
    }, [editorState]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="select-image"
        >
            <DialogTitle id="select-image-title">
                {mode === 'add' ? 'NEW SESSION UPDATE' : 'EDIT SESSION UPDATE'}
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem' }}>
                <Paper sx={{ height: '100%', minHeight: '550px' }}>
                    <WysiwygButtonGroup
                        editorState={editorState}
                        richUtils={RichUtils}
                        onChangeEditorState={setEditorState}
                    />
                    <Box
                        display='flex'
                        flexDirection='column'
                        height='100%'
                        gap={2}
                        padding={2}
                        sx={{
                            '& .DraftEditor-root': {
                                height: '500px'
                            }
                        }}
                    >
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            handleKeyCommand={handleKeyCommand}
                            spellCheck
                            preserveSelectionOnBlur
                        />
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => mode === 'add' ? handleCreateSessionUpdate() : console.log('edit')} autoFocus>
                    {mode === 'add' ? 'Publish' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditSessionUpdate;