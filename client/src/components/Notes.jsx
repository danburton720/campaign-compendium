import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent, Checkbox,
    CircularProgress,
    FormControl,
    InputLabel, ListItemText,
    MenuItem, OutlinedInput,
    Paper,
    Select,
    Stack
} from '@mui/material';

import { getAllNotes } from '../actions/noteActions';
import dayjs from 'dayjs';
import useDebouncedPending from '../hooks/useDebouncedPending';

// TODO create an endpoint to get all characters on a campaign, including deleted ones instead of getting characters off campaign state

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
    const [from, setFrom] = useState(dayjs().year(2022).month(0).date(1).hour(0).minute(0).second(0).millisecond(0));
    const [to, setTo] = useState(dayjs());
    const [filterCharacters, setFilterCharacter] = useState(() => getCharacters(characters))

    const dispatch = useDispatch();

    const { id } = useParams();

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
        if (pending) {
            return (
                <CircularProgress />
            )
        }
        return (
            <>
                {notesData.map(note => (
                    <Card id={note._id}
                          sx={{
                              backgroundColor: note.hasOwnProperty('character') ? note.character.chosenColor : 'gray',
                              color: '#fff'
                          }}
                    >
                        <CardContent>
                            {note.content}
                        </CardContent>
                    </Card>
                ))}
            </>
        )
    }

    useEffect(() => {
        dispatch(getAllNotes(id, { page, from: from.toISOString(), to: to.toISOString() }));
    }, []);

    useEffect(() => {
        console.log('filterCharacters', filterCharacters)
        const relatedCharacterParams = characters.filter(character => filterCharacters.includes(character.name)).map(character => character._id);
        if (filterCharacters.includes('DM')) relatedCharacterParams.push('DM');
        console.log('relatedCharacterParams', relatedCharacterParams)
        dispatch(getAllNotes(id, { page, from: from.toISOString(), to: to.toISOString(), relatedCharacter: relatedCharacterParams }));
    }, [filterCharacters]);

    useDebouncedPending(setPending, [notesPending]);

    return (
        <>
            <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem' marginTop='1rem'>
                <Stack gap={2} marginTop='2rem'>
                    <Paper>
                        <FormControl sx={{ m: 1, width: 300 }}>
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
                    </Paper>
                    {renderNotes()}
                </Stack>
            </Box>
        </>
    );
}

export default Notes;