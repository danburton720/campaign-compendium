import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import SelectColor from './Modals/SelectColor';

const SelectedCharacterColor = ({ currentColor, onSelectColor }) => {
    const [showSelectColorModal, setShowSelectColorModal] = useState(false);

    const handleSetChosenColor = (color) => {
        onSelectColor(color)
        setShowSelectColorModal(false);
    }

    return (
        <Box display='flex' flexDirection='column' width='50%' maxWidth='300px' gap={2}>
            <Typography variant="caption">Selected color</Typography>
            <Box height='100px' width='100%' borderRadius='.5rem' backgroundColor={currentColor || '#5A3333'} />

            <Button
                variant="contained"
                onClick={() => setShowSelectColorModal(true)}
            >
                Change colour
            </Button>
            <SelectColor
                currentColor={currentColor}
                open={showSelectColorModal}
                onClose={() => setShowSelectColorModal(false)}
                onSave={color => handleSetChosenColor(color)}
            />
        </Box>
    )
}

export default SelectedCharacterColor;