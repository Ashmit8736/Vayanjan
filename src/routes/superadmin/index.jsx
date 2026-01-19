import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SuperAdminDashboard from '../../features/superadmin/SuperAdminDashboard';
import PrivateRoute from '../PrivateRoute';

const SuperAdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <SuperAdminDashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default SuperAdminRoutes;
