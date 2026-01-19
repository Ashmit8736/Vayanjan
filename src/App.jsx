import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import Login from './features/auth/Login';
import SuperAdminRoutes from './routes/superadmin';
import useOnlineStatus from './hooks/useOnlineStatus';

// Create Material-UI theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

function App() {
    const isOnline = useOnlineStatus();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Handle window state on auth change
        if (isAuthenticated) {
            // If logged in (including auto-login), maximize window
            if (window.electronAPI) {
                window.electronAPI.loginSuccess();
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        console.log('Network status:', isOnline ? 'Online' : 'Offline');
    }, [isOnline]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                    }
                />
                <Route path="/*" element={<SuperAdminRoutes />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                {/* Fallback for unknown routes not handled by sub-routers */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
