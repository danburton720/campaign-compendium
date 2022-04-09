import { SnackbarProvider as NotiSnackbarProvider } from 'notistack';
import { useTheme } from '@mui/material/styles';

const SnackbarProvider = ({children}) => {
    const theme = useTheme();

    return (
        <NotiSnackbarProvider
            sx={{
                '& .SnackbarItem-variantSuccess': {
                    backgroundColor: theme.palette.success.main,
                },
                '& .SnackbarItem-variantError': {
                    backgroundColor: theme.palette.error.main,
                },
                '& .SnackbarItem-variantWarning': {
                    backgroundColor: theme.palette.warning.main,
                },
                '& .SnackbarItem-variantInfo': {
                    backgroundColor: theme.palette.info.main,
                },
            }}
            maxSnack={4}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        >
            {children}
        </NotiSnackbarProvider>
    );
};

export default SnackbarProvider;