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
import { CHARACTER_COLORS } from '../../constants/colors';

const SelectColor = ({ currentColor, open, onClose, onSave }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [chosenColor, setChosenColor] = useState(currentColor);

    const prevOpen = usePrevious(open);

    useEffect(() => {
        if (open && !prevOpen) {
            setChosenColor(currentColor);
        }
    }, [open, prevOpen]);

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="select-color"
            disableScrollLock
        >
            <DialogTitle id="select-color-title">
                Select color
            </DialogTitle>
            <DialogContent sx={{ padding: '1rem' }}>
                <Box display='flex' gap={2} flexWrap='wrap'>
                    {CHARACTER_COLORS.map((color, index) => (
                        <Box
                            key={index}
                            width='100px'
                            height='100px'
                            marginTop='1rem'
                            button
                            sx={{
                                borderRadius: '8px',
                                padding: '5px',
                                border: (color === chosenColor || (color === '#5A3333' && chosenColor === undefined)) ? `.2rem solid ${theme.palette.primary.main}` : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => setChosenColor(color)}
                        >
                            <Box height='100%' width='100%' backgroundColor={color} borderRadius='8px' />
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Close
                </Button>
                <Button onClick={() => onSave(chosenColor)} autoFocus>
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SelectColor;