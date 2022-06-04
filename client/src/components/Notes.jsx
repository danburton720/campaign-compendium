import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress, Collapse,
    FormControl, IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Pagination,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import { addNote, getAllNotes } from '../actions/noteActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import NoteCard from './NoteCard';
import AddEditNote from './Modals/AddEditNote';
import { usePrevious } from '../hooks/usePrevious';
import { ROUTES } from '../constants';

// TODO create an endpoint to get all characters on a campaign, including deleted ones instead of getting characters off campaign state
// TODO provide option to reset filters - only display when filters are different to initial values

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

const getCharacters = (characters) => {
    if (characters.length === 0) return ['DM'];
    const characterList = characters.map(character => (character.name));
    characterList.push('DM');
    return characterList;
}

const Notes = () => {
    const notesPending = useSelector(state => state.notes.pending);
    const notesData = useSelector(state => state.notes.data);
    const notesTotal = useSelector(state => state.notes.total);
    const characters = useSelector(state => state.campaigns.campaignData.characters || []);
    const updateNotePending = useSelector(state => state.notes.updatePending);
    const updateNoteSuccess = useSelector(state => state.notes.updateSuccess);
    const updateNoteError = useSelector(state => state.notes.updateError);
    const deleteNotePending = useSelector(state => state.notes.deletePending);
    const deleteNoteSuccess = useSelector(state => state.notes.deleteSuccess);
    const deleteNoteError = useSelector(state => state.notes.deleteError);
    const addNotePending = useSelector(state => state.notes.addPending);
    const addNoteSuccess = useSelector(state => state.notes.addSuccess);
    const addNoteError = useSelector(state => state.notes.addError);

    const [pending, setPending] = useState(false);
    const [page, setPage] = useState(1);
    const [from, setFrom] = useState(dayjs().startOf('year').subtract(1, 'year'));
    const [to, setTo] = useState(dayjs().add(1, 'hour',));
    const [filterCharacters, setFilterCharacter] = useState(() => getCharacters(characters));
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    const { enqueueSnackbar } = useSnackbar();

    const prevAddNotePending = usePrevious(addNotePending);
    const prevUpdateNotePending = usePrevious(updateNotePending);
    const prevDeleteNotePending = usePrevious(deleteNotePending);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilterCharacter(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const renderNotes = () => {
        if (!pending && notesData.length === 0) {
            return (
                <Alert severity="info" sx={{ marginTop: '1rem' }}>No notes have been added to this campaign</Alert>
            )
        }

        if (pending) {
            return (
                <Box height='100%' width='100%' display='flex' alignItems='center' justifyContent='center'>
                    <CircularProgress />
                </Box>
            )
        }
        return (
            <Box height='100%' overflow='auto' display='flex' flexDirection='column' gap={2}>
                {notesData.map(note => (
                    <React.Fragment key={note._id}>
                        <NoteCard note={note} characters={characters} onAddOrDelete={() => fetchData()} />
                    </React.Fragment>
                ))}
            </Box>
        )
    }

    const fetchData = () => {
        // TODO only get all notes if you're the DM - otherwise all the player get notes endpoint
        const relatedCharacterParams = characters.filter(character => filterCharacters.includes(character.name)).map(character => character._id);
        if (filterCharacters.includes('DM')) relatedCharacterParams.push('DM');
        dispatch(getAllNotes(id, { page, pageSize: 10, from: from.toISOString(), to: to.toISOString(), relatedCharacter: relatedCharacterParams }));
    }

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        if (!addNotePending && prevAddNotePending) {
            if (addNoteSuccess) enqueueSnackbar('Note successfully added', { variant: 'success' });
            if (addNoteError) enqueueSnackbar(addNoteError, { variant: 'error' });
        }
    }, [addNotePending, prevAddNotePending, addNoteSuccess, addNoteError]);

    useEffect(() => {
        if (!updateNotePending && prevUpdateNotePending) {
            if (updateNoteSuccess) enqueueSnackbar('Note successfully updated', { variant: 'success' });
            if (updateNoteError) enqueueSnackbar(addNoteError, { variant: 'error' });
        }
    }, [updateNotePending, prevUpdateNotePending, updateNoteSuccess, updateNoteError]);

    useEffect(() => {
        if (!deleteNotePending && prevDeleteNotePending) {
            if (deleteNoteSuccess) enqueueSnackbar('Note successfully deleted', { variant: 'success' });
            if (deleteNoteError) enqueueSnackbar(addNoteError, { variant: 'error' });
        }
    }, [deleteNotePending, prevDeleteNotePending, deleteNoteSuccess, deleteNoteError]);

    useDebouncedPending(setPending, [notesPending]);

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
                <Stack gap={2} marginTop='2rem'>
                    <Button
                        variant="contained"
                        onClick={() => setShowAddNoteModal(true)}
                        startIcon={<AddIcon />}
                        sx={{
                            width: 'fit-content',
                            alignSelf: 'flex-end'
                        }}
                    >
                        Add note
                    </Button>
                    <Box
                        height='30px'
                        width='30px'
                        borderRadius='4px'
                        bgcolor='white'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        alignSelf='flex-end'
                    >
                        <IconButton onClick={() => setShowFilters(!showFilters)} disabled={pending}>
                            <FilterAltIcon />
                        </IconButton>
                    </Box>
                    <Collapse in={showFilters}>
                        <Paper
                            sx={{
                                padding: '1rem'
                            }}
                        >
                            <Stack gap={2} width="100%">
                                <Typography variant="h4">Filters</Typography>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id="filter-characters-label">Characters</InputLabel>
                                    <Select
                                        labelId="filter-characters-label"
                                        id="filter-characters"
                                        multiple
                                        value={filterCharacters}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Characters" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {[{ _id: 0, name: 'DM' }].concat(characters).map((character) => (
                                            <MenuItem key={character._id} value={character.name}>
                                                <Checkbox checked={filterCharacters.indexOf(character.name) > -1} />
                                                <ListItemText primary={character.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box display='flex' gap={2} flexWrap='wrap'>
                                    <DatePicker
                                        label="From"
                                        value={from}
                                        onChange={(newValue) => {
                                            const newValueEarliestTime = dayjs(newValue).startOf('date');
                                            setFrom(newValueEarliestTime);
                                        }}
                                        inputFormat="DD/MM/YYYY"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                        sx={{ marginTop: '1rem' }}
                                    />
                                    <DatePicker
                                        label="To"
                                        value={to}
                                        onChange={(newValue) => {
                                            const newValueLatestTime = dayjs(newValue).endOf('date').hour(24);
                                            setTo(newValueLatestTime);
                                        }}
                                        inputFormat="DD/MM/YYYY"
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                        sx={{ marginTop: '1rem' }}
                                    />
                                </Box>
                                <Box display='flex' gap={2} width='400px' alignSelf='flex-end'>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '50%'
                                        }}
                                        onClick={() => setShowFilters(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '50%'
                                        }}
                                        onClick={() => {
                                            fetchData();
                                            setShowFilters(false);
                                        }}
                                    >
                                        Apply filters
                                    </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Collapse>
                    <Box
                        display='flex'
                        height='100%'
                        flexDirection='column'
                        gap={2}
                    >
                        {renderNotes()}
                        {notesData.length > 0 &&
                            <Paper
                                sx={{
                                    padding: '1rem 0',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    justifySelf: 'flex-end'
                                }}
                            >
                                <Pagination
                                    count={Math.ceil(notesTotal / 10)}
                                    color="primary"
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    disabled={pending}
                                />
                            </Paper>
                        }
                    </Box>
                </Stack>
            </Box>
            <AddEditNote
                open={showAddNoteModal}
                mode='add'
                onClose={() => setShowAddNoteModal(false)}
                onSave={async (relatedCharacter, content) => {
                    await dispatch(addNote(id, relatedCharacter, content));
                    fetchData();
                    setShowAddNoteModal(false);
                }}
                characters={characters}
            />
        </>
    );
}

export default Notes;