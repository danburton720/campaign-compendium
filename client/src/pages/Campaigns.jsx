import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
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
            <div>Campaigns page</div>
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