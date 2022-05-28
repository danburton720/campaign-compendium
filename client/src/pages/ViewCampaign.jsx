import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import FeedIcon from '@mui/icons-material/Feed';
import NotesIcon from '@mui/icons-material/Notes';
import CampaignOverview from '../components/CampaignOverview';
import SessionUpdates from '../components/SessionUpdates';

const ViewCampaign = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box minHeight='calc(100vh - 7rem)'>
            {tab === 0 && <CampaignOverview />}
            {tab === 1 && <SessionUpdates />}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={4}>
                <BottomNavigation
                    showLabels
                    value={tab}
                    onChange={(_event, newValue) => setTab(newValue)}
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