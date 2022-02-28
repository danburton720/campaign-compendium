import React, { useEffect, useState } from 'react';
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { Button, Link } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

const App = () => {
    const [user, setUser] = useState();

    const googleSuccess = async res => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        setUser({ ...result, token });
        console.log('result', result)
        console.log('token', token)
        const response = await axios.post("http://localhost:4000/auth/google", { ...result, token });
        console.log('response from BE', response)
    };

    const googleFailure = async () => {
        console.log('Google sign in was unsuccessful. Try again later');
    };

    const handleLogout = () => {
        setUser({});
        // axios.post('http://localhost:4000/auth/logout')
    }

    useEffect(() => {
        console.log('user', user)
    }, [user]);

    return (
        <div>
            {!user.token &&
                <GoogleLogin
                    clientId="571947286600-voa5t9feccp2v9e2t4lsli7tve8ca09v.apps.googleusercontent.com"
                    render={(renderProps) => (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            startIcon={<GoogleIcon/>}
                        >
                            Sign In with Google
                        </Button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    cookiePolicy="single_host_origin"
                />
            }
            <Button
                variant="contained"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    );
}

export default App;
