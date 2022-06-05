import React from 'react';
import { Box, Typography } from '@mui/material';

import { getCharacterImage } from '../utils/images';
import tombstone from '../assets/tombstone.svg';

const CharacterCard = ({ character }) => {
    const characterImage = getCharacterImage(character.chosenImage);

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
                    alt='character'
                    style={{ height: '100%', width: '100%' }}
                />
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                marginTop='5px'
                width='78%'
            >
                <Box display='flex' alignItems='center'>
                    <Typography noWrap sx={{ color: '#fff', fontWeight: 400, lineHeight: '14px' }}>{character.name}</Typography>
                    {character.status === "dead" &&
                        <Box height='20px' width='20px' marginLeft='8px'>
                            <img
                                src={tombstone}
                                alt='tombstone'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    WebkitFilter: 'invert(100%)',
                                    filter: 'invert(100%)'
                                }}
                            />
                        </Box>
                    }
                </Box>
                <Typography noWrap sx={{ color: '#fff', fontWeight: 300, fontSize: '14px' }}>{`${character.race} | ${character.class}`}</Typography>
            </Box>
        </Box>
    )
}

export default CharacterCard;