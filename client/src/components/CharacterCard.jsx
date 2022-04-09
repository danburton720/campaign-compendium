import React from 'react';
import { Box, Typography } from '@mui/material';

const CharacterCard = ({ character }) => {
    return (
        <Box
            height='55px'
            display='flex'
            alignItems='center'
            padding='2px'
            backgroundColor={character.chosenColor || '#5A3333'}
            gap={2}
        >
            <Box height='100%' width='50px'>
                <img
                    src={character.chosenImage}
                    alt='character image'
                    style={{ height: '100%', width: '100%' }}
                />
            </Box>
            <Box
                display='flex'
                flexDirection='column'
            >
                <Typography>{character.name}</Typography>
                <Typography>{`${character.race} | ${character.class}`}</Typography>
            </Box>
        </Box>
    )
}

export default CharacterCard;