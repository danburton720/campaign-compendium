import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CircularProgress, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ROUTES } from '../constants';
import { getAllQuests } from '../actions/questActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import QuestAccordion from './QuestAccordion';

const Quests = () => {
    const questsPending = useSelector(state => state.quests.pending);
    const questsData = useSelector(state => state.quests.data);

    const [pending, setPending] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllQuests(id));
    }, []);

    useDebouncedPending(setPending, [questsPending]);

    const renderQuests = () => {
        if (!pending && questsData.length === 0) {
            return (
                <Alert severity="info" sx={{ marginTop: '1rem' }}>
                    No quests have been added to this campaign
                </Alert>
            )
        }

        return (
            <Box height='100%' overflow='auto' display='flex' flexDirection='column'>
                {questsData.map(quest => (
                    <React.Fragment key={quest._id}>
                        <QuestAccordion quest={quest} />
                    </React.Fragment>
                ))}
            </Box>
        )
    }

    if (pending) {
        return (
            <Box minHeight='calc(100vh - 7rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

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
                <>
                    {!pending && renderQuests()}
                </>
            </Box>
        </>
    )
}

export default Quests;