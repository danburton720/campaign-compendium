import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddEditSessionUpdate from './Modals/AddEditSessionUpdate';

const SessionUpdates = () => {
    const [showAddEditSessionUpdate, setShowAddEditSessionUpdate] = useState(false);
    const [mode, setMode] = useState('add');

    const handleCreateSessionUpdate = (content) => {
        console.log('post content', content);
        setShowAddEditSessionUpdate(false);
    }

    const handleEditSessionUpdate = (id, content) => {
        console.log('update content for id', id);
        console.log('new content', content);
        setShowAddEditSessionUpdate(false);
    }

    return (
        <>
            <Box minHeight='calc(100vh - 7rem)' paddingBottom='4rem'>
                <Button
                    variant="contained"
                    onClick={() => setShowAddEditSessionUpdate(true)}
                >
                    Post update
                </Button>
            </Box>
            <AddEditSessionUpdate
                open={showAddEditSessionUpdate}
                mode={mode}
                onClose={() => setShowAddEditSessionUpdate(false)}
                onSave={(id, content) => mode === 'add' ? handleCreateSessionUpdate(content) : handleEditSessionUpdate(id, content)}
            />
        </>
    )
}

export default SessionUpdates;