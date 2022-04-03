import React from 'react';
import { BrowserRouter, Navigate, Route, Routes as SwitchRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty } from 'ramda';

import { ROUTES } from '../constants';
import Campaigns from './Campaigns';
import Login from './Login';
import PageWrapper from './PageWrapper';
import CreateCampaign from './CreateCampaign';

const Routes = () => {
    const RequireAuth = ({ children }) => {
        const currentUser = useSelector((state) => state.auth?.currentUser);

        if (isEmpty(currentUser)) {
            return <Navigate to={ROUTES.LOGIN}/>;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <SwitchRoutes>
                <Route path={ROUTES.LOGIN} element={<Login/>}/>
                <Route path="/" element={<PageWrapper />}>
                  <Route index element={<Navigate to={ROUTES.CAMPAIGNS} />} />
                  <Route path={ROUTES.CAMPAIGNS} element={<RequireAuth><Campaigns/></RequireAuth>}/>
                  <Route path={ROUTES.CREATE_CAMPAIGN} element={<RequireAuth><CreateCampaign /></RequireAuth>}/>
                </Route>
                <Route path="*" element={<Navigate to={ROUTES.CAMPAIGNS}/>}/>
            </SwitchRoutes>
        </BrowserRouter>
    );
};

export default Routes;