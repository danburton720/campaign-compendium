import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

import { ROUTES } from '../constants';
import { getAllQuests } from '../actions/questActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import QuestAccordion from './QuestAccordion';
import { getAllCampaignCharacters } from '../actions/characterActions';
import { usePrevious } from '../hooks/usePrevious';
import { useSnackbar } from 'notistack';
import AddEditQuest from './Modals/AddEditQuest';

const Quests = () => {
    const questsPending = useSelector(state => state.quests.pending);
    const questsData = useSelector(state => state.quests.data);
    const charactersPending = useSelector(state => state.characters.pending);
    const charactersData = useSelector(state => state.characters.data);
    const deleteQuestPending = useSelector(state => state.quests.deletePending);
    const deleteQuestSuccess = useSelector(state => state.quests.deleteSuccess);
    const deleteQuestError = useSelector(state => state.quests.deleteError);

    const [pending, setPending] = useState(false);
    const [showAddQuestModal, setShowAddQuestModal] = useState(false);

    const prevDeleteQuestPending = usePrevious(deleteQuestPending);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { enqueueSnackbar } = useSnackbar();

    const fetchData = async () => {
        await dispatch(getAllQuests(id));
        await dispatch(getAllCampaignCharacters(id));
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!deleteQuestPending && prevDeleteQuestPending) {
            if (deleteQuestSuccess) enqueueSnackbar('Quest successfully deleted', { variant: 'success' });
            if (deleteQuestError) enqueueSnackbar(deleteQuestError, { variant: 'error' });
        }
    }, [deleteQuestPending, prevDeleteQuestPending, deleteQuestSuccess, deleteQuestError]);

    useDebouncedPending(setPending, [questsPending, charactersPending]);

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
                <Box display='flex' alignItems='center' gap={2} justifyContent='end' marginBottom='1rem'>
                    <Button
                        variant="contained"
                        onClick={() => setShowAddQuestModal(true)}
                        startIcon={<AddIcon/>}
                        sx={{
                            width: 'fit-content',
                        }}
                    >
                        Add quest
                    </Button>
                </Box>
                {questsData.map(quest => (
                    <React.Fragment key={quest._id}>
                        <QuestAccordion quest={quest} characters={charactersData} />
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
                <AddEditQuest
                    open={showAddQuestModal}
                    mode='add'
                    onClose={() => setShowAddQuestModal(false)}
                    onSave={async (title, description, giverName, milestones, characters) => {
                        // await dispatch(addQuest(id, title, description, giverName, milestones, characters));
                        await fetchData();
                        setShowAddQuestModal(false);
                    }}
                    allCharacters={charactersData}
                />
            </Box>
        </>
    )
}

export default Quests;