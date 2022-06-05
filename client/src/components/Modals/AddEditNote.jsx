import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    useMediaQuery,
    useTheme
} from '@mui/material';

import { usePrevious } from '../../hooks/usePrevious';

// if the user has an active character - use that character, display select disabled with that option
// if the user only has one character that is dead, do the same as above
// if the user has multiple characters which are active/dead, enable the select dropdown so they can pick the related character

const AddEditNote = ({ open, mode, onClose, onSave, characters, currentNote }) => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const [userCharacters, setUserCharacters] = useState(() => characters.filter(character => character.userId === currentUser._id && character.status !== "invited"));
    const [relatedCharacter, setRelatedCharacter] = useState(() => {
        if (currentNote && currentNote.relatedCharacter) return currentNote.relatedCharacter;
        if (campaignData?.createdBy === currentUser?._id) return 'DM';
        const userCharacters = characters.filter(character => character.userId === currentUser._id && character.status !== "invited");
        return userCharacters[0]._id;
    });
    const [noteContent, setNoteContent] = useState(currentNote ? currentNote.content : '');
    const [noteError, setNoteError] = useState(false);

    const isDM = campaignData?.createdBy === currentUser?._id;

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const prevOpen = usePrevious(open);

    useEffect(() => {
        if (open && !prevOpen) {
            setRelatedCharacter(() => {
                if (currentNote && currentNote.relatedCharacter) return currentNote.relatedCharacter;
                if (campaignData?.createdBy === currentUser?._id) return 'DM';
                const userCharacters = characters.filter(character => character.userId === currentUser._id && character.status !== "invited");
                return userCharacters[0]._id;
            });
            setUserCharacters(() => characters.filter(character => character.userId === currentUser._id && character.status !== "invited"));
            setNoteContent(currentNote ? currentNote.content : '');
            setNoteError(false);
        }
    }, [open, prevOpen]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="add-edit-note"
            disableScrollLock
        >
            <DialogTitle id="add-edit-note-title">
                {mode === 'add' ? 'NEW NOTE' : 'EDIT NOTE'}
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem', marginTop: '1rem' }}>
                <Stack paddingTop='1rem' gap={2}>
                    {!isDM &&
                        <FormControl fullWidth>
                            <InputLabel id="related-character-select-label">Related character</InputLabel>
                            <Select
                                labelId="related-character-select-label"
                                id="related-character-select"
                                value={relatedCharacter}
                                label="Related character"
                                onChange={e => setRelatedCharacter(e.target.value)}
                                disabled={userCharacters.length === 1}
                            >
                                {userCharacters.map(character => (
                                    <MenuItem
                                        key={character._id}
                                        value={character._id}
                                    >
                                        {character.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    }
                    <TextField
                        id='note-content'
                        label={`Content (${noteContent.length}/280)`}
                        variant='outlined'
                        value={noteContent}
                        onChange={(e) => {
                            setNoteError(!e.target.value);
                            setNoteContent(e.target.value);
                        }}
                        multiline
                        rows={4}
                        required
                        error={noteError}
                        helperText={noteError ? 'Note cannot be empty' : ' '}
                        autoFocus
                        inputProps={{
                            maxLength: 280
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onSave(relatedCharacter, noteContent)}>
                    {mode === 'add' ? 'Add' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditNote;