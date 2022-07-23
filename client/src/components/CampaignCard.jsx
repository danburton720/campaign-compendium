import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const CampaignCard = ({ campaign, buttonText, onButtonClick }) => {

    return (
        <Card sx={{ height: '300px', width: '350px' }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between'
            }}>
                <Box height='100%' display='flex' flexDirection='column'>
                    <Typography variant="h3">{campaign.name}</Typography>
                    <Box
                        marginTop='1rem'
                        style={{
                            maxWidth: '100%',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 6,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        <Typography>{campaign.description}</Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        justifySelf: 'flex-end'
                    }}
                    onClick={() => onButtonClick()}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}

export default CampaignCard;