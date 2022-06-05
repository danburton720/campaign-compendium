import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { usePrevious } from '../../hooks/usePrevious';
import { CHARACTER_IMAGES } from '../../constants/images';

const SelectImage = ({ currentImage, open, onClose, onSave }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [chosenImage, setChosenImage] = useState(currentImage);

    const prevOpen = usePrevious(open);

    useEffect(() => {
        if (open && !prevOpen) {
            setChosenImage(currentImage);
        }
    }, [open, prevOpen]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="select-image"
            disableScrollLock
        >
            <DialogTitle id="select-image-title">
                Select image
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem' }}>
                <Box display='flex' gap={2} flexWrap='wrap'>
                    {CHARACTER_IMAGES.map((image, index) => (
                        <Box
                            key={index}
                            width='100px'
                            height='100px'
                            marginTop='1rem'
                            button
                            sx={{
                                borderRadius: '2px',
                                outline: (image.name === chosenImage || (image.name === 'ranger1' && chosenImage === undefined)) ? `.2rem solid ${theme.palette.primary.main}` : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setChosenImage(image.name)}
                        >
                            <img
                                src={image.image}
                                alt='chosen character'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    filter: 'brightness(0) saturate(100%)'
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Close
                </Button>
                <Button onClick={() => onSave(chosenImage)} autoFocus>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SelectImage;