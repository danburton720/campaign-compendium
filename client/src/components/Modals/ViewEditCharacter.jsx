import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TextField, Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { usePrevious } from '../../hooks/usePrevious';
import CharacterCard from '../CharacterCard';
import SelectedCharacterImage from '../SelectedCharacterImage';
import SelectedCharacterColor from '../SelectedCharacterColor';

const ViewEditCharacter = ({ character, open, onClose, onSave, editMode }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [name, setName] = useState(character.name);
    const [description, setDescription] = useState(character.description);
    const [race, setRace] = useState(character.race);
    const [characterClass, setCharacterClass] = useState(character.class);
    const [externalLink, setExternalLink] = useState(character.externalLink);
    const [chosenImage, setChosenImage] = useState(character.chosenImage);
    const [chosenColor, setChosenColor] = useState(character.chosenColor);
    const [previewCharacter, setPreviewCharacter] = useState({});

    const prevOpen = usePrevious(open);

    useEffect(() => {
        if (open && !prevOpen) {
            setName(character.name);
            setDescription(character.description);
            setRace(character.race);
            setCharacterClass(character.class);
            setExternalLink(character.externalLink);
            setChosenImage(character.chosenImage);
            setChosenColor(character.chosenColor);
        }
    }, [open, prevOpen]);

    useEffect(() => {
        setPreviewCharacter({
            name: name || 'Unnamed character',
            description: description || 'No description',
            race: race || 'Unknown race',
            class: characterClass || 'Unknown class',
            externalLink: externalLink || '',
            chosenImage,
            chosenColor: chosenColor || '#5A3333'
        });
    }, [name, race, description, characterClass, externalLink, chosenImage, chosenColor]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="view-edit-character"
            disableScrollLock
        >
            <DialogTitle id="view-edit-character-title">
                View character
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem' }}>
                <Box display='flex' flexDirection='column' gap={2}>
                    <TextField
                        required
                        label={`Character name (${name.length}/35)`}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        error={!name}
                        helperText={!name ? 'Name is required' : ' '}
                        sx={{
                            marginTop: '1rem',
                            '& .Mui-disabled input': {
                                '-webkit-text-fill-color': 'black !important'
                            },
                            '& .Mui-disabled.MuiInputBase-adornedStart': {
                                '-webkit-text-fill-color': 'black !important'
                            }
                        }}
                        inputProps={{
                            maxLength: 35
                        }}
                    />
                    <TextField
                        required
                        label={`Character description (${description.length}/1000)`}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        error={!description}
                        helperText={!name ? 'Description is required' : ' '}
                        multiline
                        rows={6}
                        sx={{
                            '& .Mui-disabled textarea': {
                                '-webkit-text-fill-color': 'black !important'
                            },
                            '& .Mui-disabled.MuiInputBase-adornedStart': {
                                '-webkit-text-fill-color': 'black !important'
                            }
                        }}
                        inputProps={{
                            maxLength: 1000
                        }}
                    />
                    <TextField
                        required
                        label={`Character race (${race.length}/20)`}
                        value={race}
                        onChange={e => setRace(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        error={!race}
                        helperText={!race ? 'Race is required' : ' '}
                        sx={{
                            '& .Mui-disabled input': {
                                '-webkit-text-fill-color': 'black !important'
                            },
                            '& .Mui-disabled.MuiInputBase-adornedStart': {
                                '-webkit-text-fill-color': 'black !important'
                            }
                        }}
                        inputProps={{
                            maxLength: 20
                        }}
                    />
                    <TextField
                        required
                        label={`Character class (${characterClass.length}/20)`}
                        value={characterClass}
                        onChange={e => setCharacterClass(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        error={!characterClass}
                        helperText={!characterClass ? 'Class is required' : ' '}
                        sx={{
                            '& .Mui-disabled input': {
                                '-webkit-text-fill-color': 'black !important'
                            },
                            '& .Mui-disabled.MuiInputBase-adornedStart': {
                                '-webkit-text-fill-color': 'black !important'
                            }
                        }}
                        inputProps={{
                            maxLength: 20
                        }}
                    />
                    <TextField
                        label='Link to online character sheet'
                        value={externalLink}
                        onChange={e => setExternalLink(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        sx={{
                            '& .Mui-disabled input': {
                                '-webkit-text-fill-color': 'black !important'
                            },
                            '& .Mui-disabled.MuiInputBase-adornedStart': {
                                '-webkit-text-fill-color': 'black !important'
                            }
                        }}
                        inputProps={{
                            maxLength: 100
                        }}
                    />
                </Box>
                {editMode &&
                    <Box display='flex' gap={2} marginTop='2rem'>
                        <SelectedCharacterImage currentImage={chosenImage} onSelectImage={image => setChosenImage(image)} />
                        <SelectedCharacterColor currentColor={chosenColor} onSelectColor={color => setChosenColor(color)} />
                    </Box>
                }
                <Box display='flex' flexDirection='column' marginTop='1rem'>
                    <CharacterCard character={previewCharacter} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Close
                </Button>
                {editMode &&
                    <Button onClick={() => onSave({ ...previewCharacter })} autoFocus>
                        Update
                    </Button>
                }
            </DialogActions>
        </Dialog>
    );
}

export default ViewEditCharacter;