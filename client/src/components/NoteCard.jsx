import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { getCharacterImage } from '../utils/images';
import DM from '../assets/dm.svg';

const NoteCard = ({ note }) => {
    const character =  note.hasOwnProperty('character') ? note.character : 'DM';
    const characterImage = character !== 'DM' ? getCharacterImage(character.chosenImage) : DM;

    return (
        <Card
            sx={{
                backgroundColor: character !== 'DM' ? note.character.chosenColor : 'gray',
                color: '#fff'
            }}
        >
            <CardContent>
                <Box display='flex' alignItems='center'>
                    <Box height='50px' width='50px' marginRight='1rem'>
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
                        <Typography noWrap sx={{ color: '#fff', fontWeight: 400, lineHeight: '14px' }}>{character !== 'DM' ? character.name : 'DM'}</Typography>
                        <Typography noWrap sx={{ color: '#fff', fontWeight: 300, fontSize: '14px' }}>{character !== 'DM' ? `${character.race} | ${character.class}` : 'Dungeon Master'}</Typography>
                    </Box>
                </Box>
                <Box
                    marginTop='1rem'
                >
                    {note.content}
                </Box>
            </CardContent>
        </Card>
    );
}

export default NoteCard;