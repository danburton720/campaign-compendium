export const extraTypography = {
    // Menu item 1
    menu1: {
        fontWeight: 900, // black/heavy
        fontSize: '18px',
        letterSpacing: '0.79px',
        lineHeight: '16px',
        textTransform: 'uppercase'
    },
    // Menu item 2
    menu2: {
        fontWeight: 900, // black/heavy
        fontSize: '14px',
        letterSpacing: '0.62px',
        lineHeight: '16px',
        textTransform: 'uppercase'
    },
    noteCardUserName: {
        fontWeight: 700, //bold
        fontSize: '22px',
        letterSpacing: '0.33px',
        lineHeight: '24px'
    }
};

export const extraPalette = {
    GREY1: '#FBFBFB',
    GREY2: '#F5F5F5',
    GREY3: '#DBDBDB',
    GREY4: '#C2C2C2',
    GREY5: '#8F8F8F',
    GREY6: '#5C5C5C',
    GREY7: '#424242',
    GREY8: '#292929',
    BLACK: '#1B1C1D',
    BLACK2: '#000000',
    WHITE: '#FFFFFF',
    BLUE: '#3F627F',
    TEAL: '#00A098',
    PINK: '#F06778',
    RED: '#B43B1E'
};

export const extraShadows = {
    SHADOW1: '4px 4px 4px #2929290A',
    SHADOW2: '4px 4px 4px #00000029'
};

export const mui_theme = {
    palette: {
        primary: {
            main: '#0D7288',
        },
        success: {
            main: '#31B886',
        },
        info: {
            main: '#00A098'
        },
        error: {
            main: '#9b0a11'
        },
        warning: {
            main: '#FF9800'
        },
        text: {
            primary: extraPalette.BLACK,
            secondary: extraPalette.GREY5
        },
        background: {
            default: extraPalette.GREY1
        }
    },
    typography: {
        fontFamily: ['Heebo', 'sans-serif'].join(','),
        htmlFontSize: 16,
        // Headline 1
        h1: {
            fontWeight: 500, // medium
            fontSize: '30px',
            // letterSpacing: '2.05px',
            lineHeight: '35px'
        },
        // Headline 2
        h2: {
            fontWeight: 500, // medium
            fontSize: '28px',
            // letterSpacing: '1.54px',
            lineHeight: '36px'
        },
        // Headline 3
        h3: {
            fontWeight: 400, // regular
            fontSize: '20px',
            // letterSpacing: '1.14px',
            lineHeight: '26px'
        },
        // headline 4
        h4: {
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: 0,
            lineHeight: '16px',
        },
        // h5: {
        // 		fontWeight: 600,
        // 		fontSize: '1.25rem',
        // 		lineHeight: '1.4em',
        // },
        // Move score
        h6: {
            fontWeight: 700, // bold
            fontSize: '20px',
            letterSpacing: '-0.3px',
            lineHeight: '16px',
        },
        // Link
        subtitle1: {
            fontWeight: 400, // medium
            fontSize: '16px',
            letterSpacing: '-0.24px',
            lineHeight: '20px',
        },
        // Small link
        // smallLink: {
        // 		fontWeight: 500, // medium
        // 		fontSize: '14px',
        // 		letterSpacing: '0.25px',
        // 		lineHeight: '16px',
        // },
        // Smaller text
        subtitle2: {
            fontWeight: 400, // regular (can be bold 700)
            fontSize: '14px',
            // letterSpacing: '-0.21px',
            lineHeight: '18px',
        },
        // Paragraphs
        body1: {
            fontWeight: 400, // regular (can be medium 500 or bold 700)
            fontSize: '18px',
            // letterSpacing: '-0.27px',
            lineHeight: '24px'
        },
        // Table content
        body2: {
            fontWeight: 400, // regular
            fontSize: '16px',
            // letterSpacing: '-0.24px',
            lineHeight: '24px',
        },
        // Button
        // button: {
        //     fontWeight: 700, // bold (can be medium 500)
        //     fontSize: '16px',
        //     letterSpacing: '0.38px',
        //     lineHeight: '24px',
        // },
        // Micro text
        caption: {
            fontWeight: 500, // medium
            fontSize: '10px',
            letterSpacing: '0.32px',
            lineHeight: '14px'
        },
        // overline: {
        // 		fontWeight: 700,
        // 		fontSize: '0.6875rem',
        // 		lineHeight: '1.4em',
        // 		letterSpacing: '0.02em',
        // }
    }
};
