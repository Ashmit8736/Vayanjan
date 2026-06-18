import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import UserAdminDashboard from "./features/useradmin/UserAdminDashboard";
import InventoryDashboard from "./features/userinventory/InventoryDashboard";
import BillingDashboard from "./features/userBilling/BillingDashboard";
import PublicInvoiceView from "./features/userBilling/PublicInvoiceView";
import Login from "./features/auth/Login";
import ManagerDashboard from "./features/manager/ManagerDashboard";
import SuperAdminRoutes from "./routes/superadmin";
import useOnlineStatus from "./hooks/useOnlineStatus";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
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
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
    console.log("Network status:", isOnline ? "Online" : "Offline");
  }, [isOnline]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/public/invoice/:invoiceNumber" element={<PublicInvoiceView />} />
        
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.role === "inventory" ? (
                <Navigate to="/inventory" replace />
              ) : user?.role === "billing" ? (
                <Navigate to="/billing" replace />
              ) : user?.role === "owner" || user?.role === "user" ? (
                <Navigate to="/user-admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Client User Dashboard */}
        <Route
          path="/user-admin/*"
          element={
            isAuthenticated ? (
              <UserAdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/inventory/*"
          element={
            isAuthenticated && (user?.role === "inventory" || user?.role === "owner" || user?.role === "both") ? (
              <InventoryDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/billing/*"
          element={
            isAuthenticated && (user?.role === "billing" || user?.role === "owner" || user?.role === "both") ? (
              <BillingDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/manager/*"
          element={
            isAuthenticated && (user?.role === "manager" || user?.role === "both") ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Super Admin Routes - Catch all remainder */}
        <Route path="/*" element={<SuperAdminRoutes />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
