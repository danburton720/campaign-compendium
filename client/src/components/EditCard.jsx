import React from 'react';
import { Box, Button, Card, CardContent, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const EditCard = ({ value, valueSetter, modeSetter, onSave, label, helperText, multiline = false }) => {
    return (
        <Card sx={{ width: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label={label}
                    required
                    fullWidth
                    value={value}
                    onChange={(e) => valueSetter(e.target.value)}
                    error={!value}
                    helperText={!value ? helperText : ' '}
                    multiline
                    rows={multiline ? 8 : 0}
                />
                <Box display='flex' marginTop='1rem' gap={2} alignSelf='flex-end'>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => modeSetter(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={!value}
                        onClick={() => onSave()}
                    >
                        Save
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}

export default EditCard;