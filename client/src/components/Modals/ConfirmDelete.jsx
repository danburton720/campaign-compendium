import React from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme
} from '@mui/material';

const ConfirmDelete = ({ open, onClose, onConfirm, modalTitle, modalSubheading }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => onClose()}
            aria-labelledby="confirm-delete"
        >
            <DialogTitle id="confirm-delete-title">
                {modalTitle || 'Confirm delete'}
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" variant="filled">
                    {modalSubheading || 'This action cannot be reversed'}
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => onConfirm()} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDelete;