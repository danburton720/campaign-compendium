import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { getCharacterImage } from '../utils/images';
import SelectImage from './Modals/SelectImage';

const SelectedCharacterImage = ({ currentImage, onSelectImage }) => {
    const [showSelectImageModal, setShowSelectImageModal] = useState(false);

    const image = getCharacterImage(currentImage);

    const handleSetChosenImage = (image) => {
        onSelectImage(image)
        setShowSelectImageModal(false);
    }

    return (
        <Box display='flex' flexDirection='column' width='50%' maxWidth='300px' gap={2}>
            <Typography variant="caption">Selected image</Typography>
            <Box height='100px' width='100%'>
                <img
                    src={image}
                    alt='chosen character'
                    style={{
                        height: '100%',
                        width: '100%',
                        filter: 'brightness(0) saturate(100%)'
                    }}
                />
            </Box>
            <Button
                variant="contained"
                onClick={() => setShowSelectImageModal(true)}
            >
                Change image
            </Button>
            <SelectImage
                currentImage={currentImage}
                open={showSelectImageModal}
                onClose={() => setShowSelectImageModal(false)}
                onSave={image => handleSetChosenImage(image)}
            />
        </Box>
    )
}

export default SelectedCharacterImage;