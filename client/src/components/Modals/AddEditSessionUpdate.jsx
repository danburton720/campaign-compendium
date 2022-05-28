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
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { usePrevious } from '../../hooks/usePrevious';
import WysiwygButtonGroup from '../UI/WysiwygButtonGroup';


const AddEditSessionUpdate = ({ open, mode, onClose, onSave, currentContent }) => {
    const [editorState, setEditorState] = useState(currentContent || EditorState.createEmpty());

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const prevOpen = usePrevious(open);

    const handleKeyCommand = (command, editorState) => {
        let newState = RichUtils.handleKeyCommand(editorState, command);

        console.log('command', command)

        if (['bold', 'underline', 'italic'].includes(command)) {
            newState = RichUtils.toggleInlineStyle(editorState, command.toUpperCase());
        }

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    useEffect(() => {
        if (open && !prevOpen) {
            setEditorState(currentContent || EditorState.createEmpty());
        }
    }, [open, prevOpen]);

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
                        <WysiwygButtonGroup
                            editorState={editorState}
                            richUtils={RichUtils}
                            onChangeEditorState={setEditorState}
                        />
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            handleKeyCommand={handleKeyCommand}
                        />
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onSave(editorState)} autoFocus>
                    {mode === 'add' ? 'Publish' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditSessionUpdate;