import React from 'react';
import { Box, Typography } from '@mui/material';

import { getCharacterImage } from '../utils/images';

const CharacterCard = ({ character }) => {
    console.log('character', character)

    const characterImage = getCharacterImage(character.chosenImage);

    console.log('characterImage', characterImage)

    return (
        <Box
            height='55px'
            display='flex'
            alignItems='center'
            padding='2px'
            backgroundColor={character.chosenColor || '#5A3333'}
            gap={2}
            borderRadius='4px'
            width='100%'
            maxWidth='400px'
        >
            <Box height='50px' width='50px'>
                <img
                    src={characterImage}
                    alt='character image'
                    style={{ height: '100%', width: '100%' }}
                />
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                marginTop='5px'
                width='78%'
            >
                <Typography noWrap sx={{ color: '#fff', fontWeight: 400, lineHeight: '14px' }}>{character.name}</Typography>
                <Typography noWrap sx={{ color: '#fff', fontWeight: 300, fontSize: '14px' }}>{`${character.race} | ${character.class}`}</Typography>
            </Box>
        </Box>
    )
}

export default CharacterCard;