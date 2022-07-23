import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { usePrevious } from '../../hooks/usePrevious';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddEditQuest = ({ open, mode, onClose, onSave, allCharacters, currentQuest }) => {
    const [title, setTitle] = useState(currentQuest ? currentQuest.title : '');
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState(currentQuest ? currentQuest.description : '');
    const [descriptionError, setDescriptionError] = useState(false);
    const [giverName, setGiverName] = useState(currentQuest ? currentQuest.giverName : '');
    const [milestones, setMilestones] = useState(currentQuest ? currentQuest.milestones : []);
    const [milestoneErrors, setMilestoneErrors] = useState(currentQuest ? currentQuest.milestones.map(_milestone => false) : []);
    const [characters, setCharacters] = useState(currentQuest ? currentQuest.characters : []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const prevOpen = usePrevious(open);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCharacters(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    useEffect(() => {
        if (open && !prevOpen) {
            setTitle(currentQuest ? currentQuest.title : '');
            setDescription(currentQuest ? currentQuest.description : '');
            setGiverName(currentQuest ? currentQuest.giverName : '');
            setMilestones(currentQuest ? currentQuest.milestones : []);
            setCharacters(currentQuest ? currentQuest.characters : []);
            setTitleError(false);
            setDescriptionError(false);
            setMilestoneErrors(currentQuest ? currentQuest.milestones.map(_milestone => false) : []);
        }
    }, [open, prevOpen]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="add-edit-quest"
            disableScrollLock
        >
            <DialogTitle id="add-edit-quest-title">
                {mode === 'add' ? 'NEW QUEST' : 'EDIT QUEST'}
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem', marginTop: '1rem' }}>
                <Stack paddingTop='1rem' gap={1}>
                    <TextField
                        id='quest-title'
                        label={`Title (${title.length}/200)`}
                        variant='outlined'
                        value={title}
                        onChange={(e) => {
                            setTitleError(!e.target.value);
                            setTitle(e.target.value);
                        }}
                        required
                        error={titleError}
                        helperText={titleError ? 'Title cannot be empty' : ' '}
                        autoFocus
                        inputProps={{
                            maxLength: 200
                        }}
                    />
                    <TextField
                        id='quest-description'
                        label={`Description (${description.length}/500)`}
                        variant='outlined'
                        value={description}
                        onChange={(e) => {
                            setDescriptionError(!e.target.value);
                            setDescription(e.target.value);
                        }}
                        multiline
                        rows={4}
                        required
                        error={descriptionError}
                        helperText={descriptionError ? 'Description cannot be empty' : ' '}
                        autoFocus
                        inputProps={{
                            maxLength: 500
                        }}
                    />
                    <TextField
                        id='quest-giver-name'
                        label={`Quest giver (${giverName.length}/100)`}
                        variant='outlined'
                        value={giverName}
                        onChange={(e) => setGiverName(e.target.value)}
                        helperText={' '}
                        autoFocus
                        inputProps={{
                            maxLength: 100
                        }}
                    />
                    <Stack gap={2}>
                        <Typography variant="subtitle2">Objectives</Typography>
                        {milestones.length ? (
                            <>
                                {milestones.map((milestone, index) => {
                                    const isError = milestoneErrors[index];
                                    console.log('seeing if the milestone is in error')
                                    console.log('milestoneErrors', milestoneErrors)
                                    console.log('index', index)
                                    return (
                                        <Box
                                            key={milestone._id}
                                            display='flex'
                                            alignItems='center'
                                            justifyContent='space-between'
                                        >
                                            <TextField
                                                id="objective"
                                                label={`Objective ${index + 1}`}
                                                variant="standard"
                                                value={milestone.name}
                                                onChange={e => {
                                                    console.log('in text field onChange')
                                                    console.log('milestones', milestones)
                                                    const newMilestones = [ ...milestones ];
                                                    console.log('newMilestones', newMilestones)
                                                    console.log('index', index)
                                                    console.log('value', e.target.value)
                                                    newMilestones[index].name = e.target.value;
                                                    setMilestones(newMilestones);
                                                    const newMilestoneErrors = [ ...milestoneErrors ];
                                                    newMilestoneErrors[index] = !e.target.value;
                                                    setMilestoneErrors(newMilestoneErrors);
                                                }}
                                                placeholder='New objective'
                                                error={isError}
                                                helperText={isError ? 'Objective must have a value' : ' '}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{
                                                    width: '90%'
                                                }}
                                            />
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    const newMilestones = [ ...milestones ];
                                                    newMilestones.splice(index, 1);
                                                    setMilestones(newMilestones);
                                                    const newMilestoneErrors = [ ...milestoneErrors ];
                                                    newMilestoneErrors.splice(index, 1);
                                                    setMilestoneErrors(newMilestoneErrors);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                )}
                            </>
                        ) : (
                            <Alert severity="info">No objectives have been added</Alert>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                console.log('adding new milestone')
                                const newMilestones = [ ...milestones ];
                                newMilestones.push({
                                    _id: Math.random(),
                                    name: '',
                                    completed: false
                                });
                                console.log('newMilestones', newMilestones)

                                setMilestones(newMilestones);
                                const newMilestoneErrors = [ ...milestoneErrors ];
                                newMilestoneErrors.push(false);
                                setMilestoneErrors(newMilestoneErrors);
                            }}
                            sx={{
                                marginBottom: '2rem'
                            }}
                        >
                            Add objective
                        </Button>
                    </Stack>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="involved-characters-label">Characters</InputLabel>
                        <Select
                            labelId="involved-characters-label"
                            id="involved-characters"
                            multiple
                            value={characters}
                            onChange={handleChange}
                            input={<OutlinedInput label="Characters" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {allCharacters.map(character => (
                                <MenuItem key={character._id} value={character.name}>
                                    <Checkbox checked={characters.indexOf(character.name) > -1} />
                                    <ListItemText primary={character.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => onSave(title, description, giverName, milestones, characters)}
                    disabled={
                        titleError ||
                        !title ||
                        descriptionError ||
                        !description ||
                        milestoneErrors.some(error => error) ||
                        !milestones.length ||
                        !characters.length ||
                        milestones.some(milestone => !milestone.name)
                    }
                >
                    {mode === 'add' ? 'Create' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditQuest;