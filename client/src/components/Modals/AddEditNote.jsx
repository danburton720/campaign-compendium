import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
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
import { sortCharactersActiveFirst } from '../../utils/character';
import { getCharacterImage } from '../../utils/images';
import tombstone from '../../assets/tombstone.svg';

const AddEditNote = ({ open, mode, onClose, onSave, characters, currentNote }) => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const [userCharacters, setUserCharacters] = useState(() => {
        const userCharacters = characters.filter(character => character.userId === currentUser._id && character.status !== 'invited');
        return sortCharactersActiveFirst(userCharacters);
    });
    const [relatedCharacter, setRelatedCharacter] = useState(() => {
        if (currentNote && currentNote.relatedCharacter) return currentNote.relatedCharacter;
        if (campaignData?.createdBy === currentUser?._id) return 'DM';
        const userCharacters = characters.filter(character => character.userId === currentUser._id && character.status !== "invited");
        if (userCharacters.length === 0) return userCharacters[0]._id;
        const userCharactersSorted = sortCharactersActiveFirst(userCharacters);
        return userCharactersSorted[0]._id;
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
                if (userCharacters.length === 0) return userCharacters[0]._id;
                const userCharactersSorted = sortCharactersActiveFirst(userCharacters);
                return userCharactersSorted[0]._id;
            });
            setUserCharacters(() => {
                const userCharacters = characters.filter(character => character.userId === currentUser._id && character.status !== 'invited');
                return sortCharactersActiveFirst(userCharacters);
            });
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
                            {userCharacters.map(character => {
                                const characterImage = getCharacterImage(character.chosenImage);

                                return (
                                    <MenuItem
                                        key={character._id}
                                        value={character._id}
                                    >
                                        <Box display='flex' alignItems='center'>
                                            <Box height='30px' width='30px' marginRight='8px'>
                                                <img
                                                    src={characterImage}
                                                    alt='character'
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                        '-webkit-filter': 'invert(100%)',
                                                        filter: 'invert(100%)'
                                                    }}
                                                />
                                            </Box>
                                            {character.name}
                                            {character.status === "dead" &&
                                            <Box height='20px' width='20px' marginLeft='8px' marginBottom='3px'>
                                                <img
                                                    src={tombstone}
                                                    alt='tombstone'
                                                    style={{
                                                        height: '100%',
                                                        width: '100%',
                                                    }}
                                                />
                                            </Box>
                                            }
                                        </Box>
                                    </MenuItem>
                                )
                            })}
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