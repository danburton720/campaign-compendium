import React from 'react';
import { Button } from '@mui/material';
import { extraPalette } from '../../themes/mui';

const CustomButton = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            sx={{
                ...props.sx,
                height: '50px',
                padding: '0 20px',
                color: extraPalette.WHITE,
                filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                background: 'linear-gradient(90deg, #0D7288 0%, #02314B 100%)',
                borderRadius: '5px',
            }}
        >
            {children}
        </Button>
    )
}

export default CustomButton;