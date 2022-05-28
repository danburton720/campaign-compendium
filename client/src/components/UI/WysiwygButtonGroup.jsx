import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

const WysiwygButtonGroup = ({ editorState, onChangeEditorState, richUtils }) => {
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    const [isBold, setIsBold] = useState(currentStyle.has('BOLD'));
    const [isItalic, setIsItalic] = useState(currentStyle.has('ITALIC'));
    const [isUnderlined, setIsUnderlined] = useState(currentStyle.has('UNDERLINE'));

    useEffect(() => {
        setIsBold(currentStyle.has('BOLD'));
        setIsItalic(currentStyle.has('ITALIC'));
        setIsUnderlined(currentStyle.has('UNDERLINE'));
    }, [editorState]);


    return (
        <div>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={blockType}
                    exclusive
                    onChange={(event, blockType) => onChangeEditorState(richUtils.toggleBlockType(editorState, blockType))}
                    aria-label="headings"
                >
                    <ToggleButton value="header-one" aria-label="header one">
                        H1
                    </ToggleButton>
                    <ToggleButton value="header-two" aria-label="header two">
                        H2
                    </ToggleButton>
                    <ToggleButton value="header-three" aria-label="header three">
                        H3
                    </ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <Box
                    display='flex'
                    alignItems='center'
                >
                    <ToggleButton
                        size="small"
                        value="bold"
                        selected={isBold}
                        aria-label="bold"
                        onChange={() => {
                            setIsBold(!isBold)
                            onChangeEditorState(richUtils.toggleInlineStyle(editorState, 'BOLD'));
                        }}
                        sx={{
                            border: 0,
                            width: '31.63px',
                            height: '36.75px'
                        }}
                    >
                        <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="italic"
                        selected={isItalic}
                        aria-label="italic"
                        onChange={() => {
                            setIsItalic(!isItalic)
                            onChangeEditorState(richUtils.toggleInlineStyle(editorState, 'ITALIC'));
                        }}
                        sx={{
                            border: 0,
                            width: '31.63px',
                            height: '36.75px'
                        }}
                    >
                        <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton
                        size="small"
                        value="underlined"
                        selected={isUnderlined}
                        aria-label="underlined"
                        onChange={() => {
                            setIsUnderlined(!isUnderlined)
                            onChangeEditorState(richUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
                        }}
                        sx={{
                            border: 0,
                            width: '31.63px',
                            height: '36.75px'
                        }}
                    >
                        <FormatUnderlinedIcon />
                    </ToggleButton>
                </Box>
            </Paper>
        </div>
    );
}

export default WysiwygButtonGroup;