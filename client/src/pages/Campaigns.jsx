import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

import { API } from '../config/api';
import { clearAllStorage } from '../actions/rootActions';


const Campaigns = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get(API.auth.logout, { withCredentials: true }).then(res => {
            if (res.data === 'done') {
                dispatch(clearAllStorage());
                navigate('/login');
            }
        });
    };

    return (
        <>
            <Typography variant="h1">Campaigns page</Typography>
            <Button
                variant="contained"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </>
    );
};

export default Campaigns;