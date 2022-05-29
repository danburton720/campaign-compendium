import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FeedIcon from '@mui/icons-material/Feed';
import NotesIcon from '@mui/icons-material/Notes';

import CampaignOverview from '../components/CampaignOverview';
import SessionUpdates from '../components/SessionUpdates';

const getTabIndex = (tab) => {
    if (tab === null) return 0;
    if (tab === 'session-updates') return 1;
    if (tab === 'notes') return 2;
    return 0;
}

const getTabString = (id) => {
    if (id === 0) return '';
    if (id === 1) return '?tab=session-updates';
    if (id === 2) return '?tab=notes';
}


const ViewCampaign = () => {
    const { search } = useLocation();
    const tab = new URLSearchParams(search).get('tab');

    const [campaignTab, setCampaignTab] = useState(() => getTabIndex(tab));

    const navigate = useNavigate();

    return (
        <Box minHeight='calc(100vh - 7rem)'>
            {campaignTab === 0 && <CampaignOverview />}
            {campaignTab === 1 && <SessionUpdates />}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
                <BottomNavigation
                    showLabels
                    value={campaignTab}
                    onChange={(_event, newValue) => {
                        navigate({ search: getTabString(newValue) });
                        setCampaignTab(newValue);
                    }}
                >
                    <BottomNavigationAction label="Overview" icon={<ImportContactsIcon />} />
                    <BottomNavigationAction label="Session updates" icon={<FeedIcon />} />
                    <BottomNavigationAction label="Notes" icon={<NotesIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default ViewCampaign;