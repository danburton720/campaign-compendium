import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, BottomNavigation, BottomNavigationAction, Box, CircularProgress, Paper } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FeedIcon from '@mui/icons-material/Feed';
import NotesIcon from '@mui/icons-material/Notes';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { isEmpty } from 'ramda';

import CampaignOverview from '../components/CampaignOverview';
import SessionUpdates from '../components/SessionUpdates';
import Notes from '../components/Notes';
import Quests from '../components/Quests';
import { getCampaign } from '../actions/campaignActions';
import useDebouncedPending from '../hooks/useDebouncedPending';
import { usePrevious } from '../hooks/usePrevious';

const getTabIndex = (tab, isDM) => {
    if (tab === null) return 0;
    if (tab === 'session-updates') return 1;
    if (tab === 'notes') return 2;
    if (tab === 'quests') return isDM ? 3 : 0;
    return 0;
}

const getTabString = (id, isDM) => {
    if (id === 0) return '';
    if (id === 1) return '?tab=session-updates';
    if (id === 2) return '?tab=notes';
    if (id === 3) return isDM ? '?tab=quests' : '';
}

const ViewCampaign = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const campaignPending = useSelector(state => state.campaigns.campaignPending);
    const campaignData = useSelector(state => state.campaigns.campaignData);
    const campaignError = useSelector(state => state.campaigns.campaignError);

    const { search } = useLocation();
    const tab = new URLSearchParams(search).get('tab');

    const [isDM, setIsDM] = useState(campaignData?.createdBy === currentUser?._id);
    const [campaignTab, setCampaignTab] = useState(() => getTabIndex(tab, isDM));
    const [pending, setPending] = useState(true);
    const [players, setPlayers] = useState(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
    const [deadPlayers, setDeadPlayers] = useState(campaignData?.characters?.filter(character => character.status === 'dead') || []);
    const [usersCharacter, setUsersCharacter] = useState(() =>
        campaignData?.characters?.find(character => character?._id === currentUser?._id && (character?.status === "active" || character?.status === "invited")) || {}
    );
    const [usersDeadCharacters, setUsersDeadCharacters] = useState(campaignData?.characters?.filter(character => character?.userId === currentUser?._id && character?.status === "dead"));

    const navigate = useNavigate();

    const { id } = useParams();

    const dispatch = useDispatch();

    const prevCampaignPending = usePrevious(campaignPending);

    const invitedCharacter = !isEmpty(usersCharacter) && usersCharacter.status === "invited" && isEmpty(usersDeadCharacters)

    useEffect(() => {
        if (id) {
            dispatch(getCampaign(id));
        }
    }, []);

    useEffect(() => {
        if (!campaignPending && prevCampaignPending && campaignData) {
            setIsDM(campaignData?.createdBy === currentUser._id || false);
            setUsersCharacter(campaignData?.characters?.find(character => character?.userId === currentUser?._id && (character?.status === "active" || character?.status === "invited")) || {});
            setUsersDeadCharacters(campaignData?.characters?.filter(character => character?.userId === currentUser?._id && character?.status === "dead"));
            setPlayers(campaignData?.characters?.filter(character => character.status !== 'dead') || []);
            setDeadPlayers(campaignData?.characters?.filter(character => character.status === 'dead') || []);
        }
    }, [campaignPending, prevCampaignPending]);

    useDebouncedPending(setPending, [campaignPending]);

    if (!campaignPending && prevCampaignPending) {
        if (campaignError || isEmpty(campaignData)) {
            return (
                <Box minHeight='calc(100vh - 7rem)'>
                    <Alert severity="error">There was an issue fetching information for this campaign</Alert>
                </Box>
            )
        }
        if (!isDM && isEmpty(usersCharacter)) {
            return (
                <Box minHeight='calc(100vh - 7rem)'>
                    <Alert severity="error">Oh dear, it seems you don't have access to this campaign!</Alert>
                </Box>
            )
        }
    }

    if (pending) {
        return (
            <Box minHeight='calc(100vh - 7rem)' display='flex' justifyContent='center' alignItems='center'>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box minHeight='calc(100vh - 7rem)'>
            {campaignTab === 0 &&
                <CampaignOverview
                    isDM={isDM}
                    campaignData={campaignData}
                    players={players}
                    deadPlayers={deadPlayers}
                    usersCharacter={usersCharacter}
                    usersDeadCharacters={usersDeadCharacters}
                />
            }
            {campaignTab === 1 && <SessionUpdates />}
            {campaignTab === 2 && <Notes />}
            {campaignTab === 3 && isDM && <Quests />}
            {!pending && !invitedCharacter &&
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
                    <BottomNavigation
                        showLabels={!isDM}
                        value={campaignTab}
                        onChange={(_event, newValue) => {
                            navigate({ search: getTabString(newValue, isDM) });
                            setCampaignTab(newValue);
                        }}
                    >
                        <BottomNavigationAction label="Overview" icon={<ImportContactsIcon/>}/>
                        <BottomNavigationAction label="DM updates" icon={<FeedIcon/>}/>
                        <BottomNavigationAction label="Notes" icon={<NotesIcon/>}/>
                        {isDM && <BottomNavigationAction label="Quests" icon={<TravelExploreIcon />}/>}
                    </BottomNavigation>
                </Paper>
            }
        </Box>
    );
}

export default ViewCampaign;