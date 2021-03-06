import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper, Stack, TextField,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import dayjs from 'dayjs';
// import 'draft-js/dist/Draft.css';

import { usePrevious } from '../../hooks/usePrevious';
// import WysiwygButtonGroup from '../UI/WysiwygButtonGroup';

const AddEditSessionUpdate = ({ open, mode, onClose, onSave, currentContent, currentDate }) => {
    // const [editorState, setEditorState] = useState(() => {
    //     if (mode === 'edit') return EditorState.createWithContent(convertFromRaw(JSON.parse(currentContent)));
    //     else return EditorState.createEmpty();
    // });
    const [content, setContent] = useState(currentContent ? currentContent : '');
    const [contentError, setContentError] = useState(false);
    const [sessionDate, setSessionDate] = useState(mode === 'edit' ? dayjs(currentDate) : dayjs());
    const [maxLengthError, setMaxLengthError] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const prevOpen = usePrevious(open);

    // const handleKeyCommand = (command, editorState) => {
    //     let newState = RichUtils.handleKeyCommand(editorState, command);
    //
    //     if (command === 'backspace') setMaxLengthError(false);
    //
    //     if (['bold', 'underline', 'italic'].includes(command)) {
    //         newState = RichUtils.toggleInlineStyle(editorState, command.toUpperCase());
    //     }
    //
    //     if (newState) {
    //         setEditorState(newState);
    //         return 'handled';
    //     }
    //
    //     return 'not-handled';
    // }

    // const handleBeforeInput = () => {
    //     const currentContent = editorState.getCurrentContent();
    //     const currentContentLength = currentContent.getPlainText('').length;
    //
    //     if (currentContentLength > 10000) {
    //         console.warn('Editor length maximum character limit reached');
    //         setMaxLengthError(true);
    //         return 'handled';
    //     }
    // }

    useEffect(() => {
        if (open && !prevOpen) {
            setSessionDate(mode === 'edit' ? dayjs(currentDate) : dayjs());
            // setEditorState(() => {
            //     if (mode === 'edit') return EditorState.createWithContent(convertFromRaw(JSON.parse(currentContent)));
            //     else return EditorState.createEmpty();
            // });
            setContent(currentContent ? currentContent : '');
            setContentError(false);
            setMaxLengthError(false);
        }
    }, [open, prevOpen, mode]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="add-edit-session-update"
            disableScrollLock
        >
            <DialogTitle id="add-edit-session-update-title">
                {mode === 'add' ? 'NEW SESSION UPDATE' : 'EDIT SESSION UPDATE'}
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem', marginTop: '1rem' }}>
                <Stack paddingTop='1rem' gap={2}>
                    <DatePicker
                        label="Session date"
                        value={sessionDate}
                        onChange={(newValue) => setSessionDate(newValue)}
                        inputFormat="DD/MM/YYYY"
                        renderInput={(params) => <TextField {...params} />}
                        sx={{ marginTop: '1rem' }}
                    />
                    {maxLengthError && <Alert severity="warning">Maximum number of characters reached</Alert>}
                    {/*<Paper sx={{ height: '100%', minHeight: '550px' }}>*/}
                    {/*    <WysiwygButtonGroup*/}
                    {/*        editorState={editorState}*/}
                    {/*        richUtils={RichUtils}*/}
                    {/*        onChangeEditorState={setEditorState}*/}
                    {/*    />*/}
                    {/*    <Box*/}
                    {/*        display='flex'*/}
                    {/*        flexDirection='column'*/}
                    {/*        height='100%'*/}
                    {/*        gap={2}*/}
                    {/*        padding={2}*/}
                    {/*        sx={{*/}
                    {/*            '& .DraftEditor-root': {*/}
                    {/*                height: '500px'*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*        overflow='auto'*/}
                    {/*    >*/}
                    {/*        <Editor*/}
                    {/*            editorState={editorState}*/}
                    {/*            onChange={setEditorState}*/}
                    {/*            handleKeyCommand={handleKeyCommand}*/}
                    {/*            spellCheck*/}
                    {/*            preserveSelectionOnBlur*/}
                    {/*            handleBeforeInput={handleBeforeInput}*/}
                    {/*        />*/}
                    {/*    </Box>*/}
                    {/*</Paper>*/}
                    <TextField
                        id='session-update-content'
                        label={`Content (${content.length}/10000)`}
                        variant='outlined'
                        value={content}
                        onChange={(e) => {
                            setMaxLengthError(e.target.value.length === 10000)
                            setContentError(!e.target.value);
                            setContent(e.target.value);
                        }}
                        multiline
                        rows={23}
                        required
                        error={contentError}
                        helperText={contentError ? 'Session update cannot be empty' : ' '}
                        autoFocus
                        inputProps={{
                            maxLength: 10000
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    // const contentState = editorState.getCurrentContent();
                    // const rawState = convertToRaw(contentState);
                    // const rawStateString = JSON.stringify(rawState);
                    onSave(sessionDate, content);
                }}>
                    {mode === 'add' ? 'Publish' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditSessionUpdate;