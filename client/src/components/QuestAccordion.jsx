import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Checkbox,
    Chip,
    Divider, FormControlLabel, FormGroup, IconButton,
    LinearProgress, ListItemIcon, Menu, MenuItem,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

import { extraPalette } from '../themes/mui';
import { API } from '../config/api';
import axios from 'axios';
import CharacterCard from './CharacterCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDelete from './Modals/ConfirmDelete';
import { addQuest, deleteQuest, editQuest, getAllQuests } from '../actions/questActions';
import AddEditQuest from './Modals/AddEditQuest';
import { useParams } from 'react-router-dom';

const QuestAccordion = ({ quest, characters }) => {
    const theme = useTheme();
    const [checkboxes, setCheckboxes] = useState(
        quest.milestones.map(
            milestone => ({ id: milestone._id, label: milestone.name, checked: milestone.complete })
        )
    );
    const [numberOfCompleteMilestones, setNumberOfCompleteMilestones] = useState(
        quest.milestones.filter(milestone => milestone.complete).length
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [showEditQuestModal, setShowEditQuestModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const { id } = useParams();

    const totalNumberOfMilestones = quest.milestones.length;
    const involvedCharacters = characters.filter(character => quest.characters.includes(character._id));

    const dispatch = useDispatch();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleCheckboxChange = async (event, milestoneId) => {
        const newCheckboxes = [ ...checkboxes ];
        const checkboxIndex = newCheckboxes.findIndex(checkbox => checkbox.id === milestoneId);
        newCheckboxes[checkboxIndex].checked = event.target.checked;
        setCheckboxes(newCheckboxes);

        setNumberOfCompleteMilestones(newCheckboxes.filter(checkbox => checkbox.checked).length);

        let endpoint;
        if (event.target.checked) {
            endpoint = API.quest_milestones.mark_complete
                .replaceAll('{questMilestoneId}', milestoneId);
        } else {
            endpoint = API.quest_milestones.mark_incomplete
                .replaceAll('{questMilestoneId}', milestoneId);
        }
        await axios.post(endpoint, {}, { withCredentials: true });
    }

    return (
        <Accordion
            sx={{
                backgroundColor: numberOfCompleteMilestones === totalNumberOfMilestones ? '#cfcfcf' : 'white',
                webkitTransition: 'background-color .5s ease-out',
                mozTransition: 'background-color .5s ease-out',
                oTransition: 'background-color .5s ease-out',
                transition: 'background-color .5s ease-out',
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display='flex' width='100%' justifyContent='space-between' alignItems='center'>
                    <Typography
                        variant="body2"
                        marginRight="1rem"
                        sx={{
                            textDecoration: numberOfCompleteMilestones === totalNumberOfMilestones ? 'line-through' : 'none',
                            color: extraPalette.GREY6
                        }}
                    >
                        {quest.title}
                    </Typography>
                    <Box display='flex' gap={1}>
                        <Divider orientation="vertical" flexItem />
                        <Chip
                            label={`${Math.round((numberOfCompleteMilestones/totalNumberOfMilestones)*100)}%`}
                            color='primary'
                            sx={{
                                marginRight: '5px',
                                width: '56px'
                            }}
                        />
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    position: 'relative'
                }}
            >
                <Box
                    display='flex'
                    position='absolute'
                    top='1rem'
                    right='5px'
                >
                    <IconButton aria-label="options" onClick={handleClick} sx={{ marginLeft: 'auto' }}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
                <Stack gap={2} marginTop='2rem'>
                    <Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Description</Typography>
                        <Typography>{quest.description}</Typography>
                    </Stack>
                    {quest.giverName &&
                        <Stack>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Quest giver</Typography>
                            <Typography>{quest.giverName}</Typography>
                        </Stack>
                    }
                    <Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Objectives</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.round((numberOfCompleteMilestones/totalNumberOfMilestones)*100)}
                            sx={{
                                marginY: '5px',
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(238, 238, 238)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 5
                                }
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: extraPalette.GREY6
                            }}
                        >
                            {`${numberOfCompleteMilestones}/${totalNumberOfMilestones} complete`}
                        </Typography>
                    </Stack>
                    <FormGroup>
                        {checkboxes.map(checkbox => (
                            <FormControlLabel
                                key={checkbox.id}
                                control={
                                    <Checkbox
                                        checked={checkbox.checked}
                                        onChange={(event) => handleCheckboxChange(event, checkbox.id)}
                                    />
                                }
                                label={checkbox.label}
                                sx={{
                                    textDecoration: checkbox.checked ? 'line-through' : 'none',
                                    color: extraPalette.GREY6
                                }}
                            />
                        ))}
                    </FormGroup>
                    <Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Characters</Typography>
                        <Box display='flex' flexWrap='wrap' gap={2}>
                            {involvedCharacters.map(character => (
                                <React.Fragment key={character._id}>
                                    <CharacterCard character={character} />
                                </React.Fragment>
                            ))}
                        </Box>
                    </Stack>
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
                        onClick={() => setShowEditQuestModal(true)}
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
            </AccordionDetails>
            <ConfirmDelete
                open={showConfirmDeleteModal}
                onClose={() => setShowConfirmDeleteModal(false)}
                onConfirm={async () => {
                    await dispatch(deleteQuest(quest._id));
                    setShowConfirmDeleteModal(false);
                }}
                modalTitle={`Delete quest?`}
                modalSubheading={`Are you sure you want to delete this quest? This action cannot be reversed.`}
            />
            <AddEditQuest
                open={showEditQuestModal}
                mode='edit'
                onClose={() => setShowEditQuestModal(false)}
                onSave={async (title, description, giverName, milestones, characters) => {
                    console.log('clicking save')
                    await dispatch(editQuest(quest._id, title, description, giverName, milestones, characters));
                    await dispatch(getAllQuests(id));
                    setShowEditQuestModal(false);
                }}
                allCharacters={characters}
                currentQuest={quest}
            />
        </Accordion>
    );
}

export default QuestAccordion;