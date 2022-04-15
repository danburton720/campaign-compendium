import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

import CharacterCard from './CharacterCard';
import { API } from '../config/api';
import { getCampaign, updateCampaignCharacter } from '../actions/campaignActions';
import { useParams } from 'react-router-dom';
import SelectedCharacterImage from './SelectedCharacterImage';
import SelectedCharacterColor from './SelectedCharacterColor';

const CreateCharacter = ({ character }) => {
    const [name, setName] = useState(character.name);
    const [description, setDescription] = useState(character.description);
    const [race, setRace] = useState(character.race);
    const [characterClass, setCharacterClass] = useState(character.class);
    const [externalLink, setExternalLink] = useState(character.externalLink);
    const [chosenImage, setChosenImage] = useState(character.chosenImage);
    const [chosenColor, setChosenColor] = useState(character.chosenColor);
    const [previewCharacter, setPreviewCharacter] = useState({});

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const { id } = useParams();

    const handleCreateCharacter = async () => {
        const endpoint = API.characters.character.replaceAll('{characterId}', character._id);
        try {
            await axios.patch(endpoint, { ...previewCharacter, status: 'active' }, { withCredentials: true });
            dispatch(updateCampaignCharacter(character._id, { ...previewCharacter }));
            dispatch(getCampaign(id));
            enqueueSnackbar('Character successfully created!', { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
        }
    }

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
        <Box margin='1rem 0'>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 500 }}>Welcome to the campaign!</Typography>
            <Typography sx={{ color: '#fff', fontWeight: 300 }}>Create a character to join</Typography>
            <Paper sx={{ width: '100%', marginTop: '1rem' }}>
                <Box display='flex' flexDirection='column' gap={2} padding='1rem'>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <TextField
                            required
                            label={`Character name (${name.length}/35)`}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            error={!name}
                            helperText={!name ? 'Name is required' : ' '}
                            sx={{
                                width: '100%',
                                maxWidth: '340px',
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
                            error={!description}
                            helperText={!description ? 'Description is required' : ' '}
                            multiline
                            rows={6}
                            inputProps={{
                                maxLength: 1000
                            }}
                        />
                        <TextField
                            required
                            label={`Character race (${race.length}/20)`}
                            value={race}
                            onChange={e => setRace(e.target.value)}
                            error={!race}
                            helperText={!race ? 'Race is required' : ' '}
                            sx={{
                                width: '100%',
                                maxWidth: '340px',
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
                            error={!characterClass}
                            helperText={!characterClass ? 'Class is required' : ' '}
                            sx={{
                                width: '100%',
                                maxWidth: '340px',
                            }}
                            inputProps={{
                                maxLength: 20
                            }}
                        />
                        <TextField
                            label='Link to online character sheet'
                            value={externalLink}
                            onChange={e => setExternalLink(e.target.value)}
                            helperText={' '}
                            sx={{
                                width: '100%',
                                maxWidth: '340px',
                            }}
                            inputProps={{
                                maxLength: 100
                            }}
                        />
                    </Box>
                    <Box display='flex' gap={2}>
                        <SelectedCharacterImage currentImage={chosenImage} onSelectImage={image => setChosenImage(image)} />
                        <SelectedCharacterColor currentColor={chosenColor} onSelectColor={color => setChosenColor(color)} />
                    </Box>
                </Box>
            </Paper>
            <Box display='flex' flexDirection='column' marginTop='1rem'>
                <Typography sx={{ color: '#fff' }}>Character preview</Typography>
                <CharacterCard character={previewCharacter} />
            </Box>
            <Button
                variant="contained"
                sx={{
                    marginTop: '2rem',
                    width: '100%',
                    maxWidth: '400px'
                }}
                disabled={!name || !description || !characterClass || !race}
                onClick={() => handleCreateCharacter()}
            >
                Create character
            </Button>
        </Box>
    )
}

export default CreateCharacter;