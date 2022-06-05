import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { getCharacterImage } from '../utils/images';
import DM from '../assets/dm.svg';
import AddEditNote from './Modals/AddEditNote';
import { deleteNote, updateNote } from '../actions/noteActions';
import ConfirmDelete from './Modals/ConfirmDelete';
import tombstone from '../assets/tombstone.svg';

const NoteCard = ({ note, characters, onAddOrDelete }) => {
    const currentUser = useSelector((state) => state.auth?.currentUser);

    const [showAddEditNoteModal, setShowAddEditNoteModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [currentNote, setCurrentNote] = useState('');
    const [currentRelatedCharacter, setCurrentRelatedCharacter] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const character =  note.hasOwnProperty('character') ? note.character : 'DM';
    const characterImage = character !== 'DM' ? getCharacterImage(character.chosenImage) : DM;

    dayjs.extend(relativeTime);

    const dispatch = useDispatch();

    const theme = useTheme();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    let canEditNote = note.createdBy === currentUser._id;
    if (note.character && note.character.deletedAt) canEditNote = false;

    return (
        <>
            <Card
                sx={{
                    backgroundColor: character !== 'DM' ? note.character.chosenColor : 'gray',
                    color: '#fff',
                    minHeight: '150px'
                }}
            >
                <CardContent
                    sx={{
                        position: 'relative'
                    }}
                >
                    {canEditNote &&
                        <Box
                            display='flex'
                            position='absolute'
                            top='1rem'
                            right='5px'
                        >
                            <IconButton aria-label="options" onClick={handleClick} sx={{ marginLeft: 'auto' }}>
                                <MoreVertIcon sx={{ color: 'white' }}/>
                            </IconButton>
                        </Box>
                    }
                    <Box display='flex' alignItems='center'>
                        <Box height='50px' width='50px' marginRight='1rem'>
                            <img
                                src={characterImage}
                                alt='character'
                                style={{ height: '100%', width: '100%' }}
                            />
                        </Box>
                        <Box
                            display='flex'
                            flexDirection='column'
                            marginTop='5px'
                            width='78%'
                        >
                            <Box display='flex' alignItems='center'>
                                <Typography noWrap sx={{ color: '#fff', fontWeight: 400, lineHeight: '14px' }}>{character !== 'DM' ? character.name : 'DM'}</Typography>
                                {note.character && note.character.deletedAt &&
                                    <Typography variant="caption" sx={{ marginLeft: '5px' }}>(deleted)</Typography>
                                }
                                {note.character && note.character.status === "dead" &&
                                    <Box height='20px' width='20px' marginLeft='8px' marginBottom='3px'>
                                        <img
                                            src={tombstone}
                                            alt='tombstone'
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                WebkitFilter: 'invert(100%)',
                                                filter: 'invert(100%)'
                                            }}
                                        />
                                    </Box>
                                }
                            </Box>
                            <Typography noWrap sx={{ color: '#fff', fontWeight: 300, fontSize: '14px' }}>{character !== 'DM' ? `${character.race} | ${character.class}` : 'Dungeon Master'}</Typography>
                        </Box>
                    </Box>
                    <Stack
                        marginTop='1rem'
                    >
                        <Typography variant="caption" sx={{ marginBottom: '2px' }}>{dayjs(note.createdAt).fromNow()}</Typography>
                        {note.content}
                    </Stack>
                    <Menu
                        anchorEl={anchorEl}
                        id="session-update-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        disableScrollLock
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                minWidth: 200,
                                maxWidth: 300,
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem
                            onClick={() => {
                                setCurrentNote(note.content);
                                setCurrentRelatedCharacter(note.relatedCharacter);
                                setShowAddEditNoteModal(true);
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setShowConfirmDeleteModal(true);
                            }}
                            sx={{
                                color: theme.palette.error.main,
                                '& .MuiListItemIcon-root': {
                                    color: 'inherit'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            Delete
                        </MenuItem>
                    </Menu>
                </CardContent>
            </Card>
            <AddEditNote
                open={showAddEditNoteModal}
                mode='edit'
                onClose={() => setShowAddEditNoteModal(false)}
                onSave={(relatedCharacter, content) => {
                    dispatch(updateNote(note._id, relatedCharacter, content));
                    setShowAddEditNoteModal(false);
                }}
                characters={characters}
                currentNote={{ content: currentNote, relatedCharacter: currentRelatedCharacter }}
            />
            <ConfirmDelete
                open={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={async () => {
                    await dispatch(deleteNote(note._id));
                    onAddOrDelete();
                    setShowConfirmDeleteModal(false);
                }}
                modalTitle={`Delete note?`}
                modalSubheading={`Are you sure you want to delete this note? This action cannot be reversed.`}
            />
        </>
    );
}

export default NoteCard;