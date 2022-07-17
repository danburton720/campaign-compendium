import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Checkbox,
    Chip,
    Divider, FormControlLabel, FormGroup,
    LinearProgress,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { extraPalette } from '../themes/mui';
import { API } from '../config/api';
import axios from 'axios';

const QuestAccordion = ({ quest }) => {
    const [checkboxes, setCheckboxes] = useState(
        quest.milestones.map(
            milestone => ({ id: milestone._id, label: milestone.name, checked: milestone.complete })
        )
    );
    const [numberOfCompleteMilestones, setNumberOfCompleteMilestones] = useState(
        quest.milestones.filter(milestone => milestone.complete).length
    );

    const totalNumberOfMilestones = quest.milestones.length;

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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display='flex' width='100%' justifyContent='space-between' alignItems='center'>
                    <Typography variant="body2" marginRight="1rem">{quest.title}</Typography>
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
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}
            >
                <Stack gap={2} marginTop='1rem'>
                    <Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Description</Typography>
                        <Typography>{quest.description}</Typography>
                    </Stack>
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
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

export default QuestAccordion;