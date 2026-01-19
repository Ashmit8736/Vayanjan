import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People,
  Restaurant,
  Receipt,
  Description,
  PowerSettingsNew,
  Person,
} from "@mui/icons-material";
import { logout } from "@store/slices/authSlice";

import DashboardOverview from "../../components/superadmin/DashboardOverview";
import NewUser from "../../components/superadmin/NewUser";
import ExistingUsers from "../../components/superadmin/ExistingUsers";

import Subscriptions from "../../components/superadmin/Subscriptions";

import { Fade } from "@mui/material";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeView, setActiveView] = React.useState("dashboard");
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    if (window.electronAPI) {
      window.electronAPI.logout();
    }
    navigate("/login");
  };

  const renderContent = () => {
    let content;
    switch (activeView) {
      case "newUser":
        content = <NewUser key="newUser" />;
        break;
      case "existingUser":
        content = <ExistingUsers key="existingUser" />;
        break;
      default:
        content = <DashboardOverview key="dashboard" />;
        break;

      case "subscriptions":
        content = <Subscriptions key="subscriptions" />;
        break;
    }
    return (
      <Fade in={true} timeout={400} key={activeView}>
        <Box sx={{ height: "100%", overflow: "hidden" }}>{content}</Box>
      </Fade>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F5F7FA" }}>
      <Box
        sx={{
          width: 260,
          bgcolor: "#FFFFFF",
          borderRight: "1px solid #EDEDED",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
          zIndex: 1200,
        }}
      >
        <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              bgcolor: "linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)",
              background: "linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)",
              borderRadius: 2,
              width: 36,
              height: 36,
              mr: 2,
              boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
            }}
          />
          <Typography
            variant="h5"
            fontWeight="800"
            sx={{
              background: "linear-gradient(45deg, #1A1A1A 30%, #424242 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vyanjan
          </Typography>
        </Box>

        <List sx={{ px: 2, flexGrow: 1 }}>
          <ListItem disablePadding sx={{ mb: 1, mt: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                pl: 2,
                fontWeight: "700",
                letterSpacing: "1px",
                opacity: 0.7,
              }}
            >
              OVERVIEW
            </Typography>
          </ListItem>

          {[
            { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
            { id: "newUser", label: "New User", icon: People },
            { id: "existingUser", label: "Existing User", icon: Restaurant },
          ].map((item) => (
            <ListItemButton
              key={item.id}
              selected={activeView === item.id}
              onClick={() => setActiveView(item.id)}
              sx={{
                borderRadius: 3,
                mb: 1,
                py: 1.5,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  bgcolor: "#FFF5E6",
                  color: "#E65100",
                  boxShadow: "0 2px 8px rgba(255, 167, 38, 0.15)",
                  "& .MuiListItemIcon-root": { color: "#EF6C00" },
                },
                "&:hover": {
                  bgcolor: activeView === item.id ? "#FFF0D4" : "#FAFAFA",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "#9E9E9E",
                  transition: "color 0.3s",
                }}
              >
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: activeView === item.id ? 700 : 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          ))}

          <ListItem disablePadding sx={{ mb: 1, mt: 3 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                pl: 2,
                fontWeight: "700",
                letterSpacing: "1px",
                opacity: 0.7,
              }}
            >
              BILLING
            </Typography>
          </ListItem>
          {/* {[
                        { label: 'Subscriptions', icon: Receipt },
                        { label: 'Invoices', icon: Description }
                    ].map((item, idx) => (
                        <ListItemButton key={idx} sx={{ borderRadius: 3, mb: 1, py: 1.5, '&:hover': { bgcolor: '#FAFAFA', transform: 'translateX(4px)' }, transition: 'all 0.3s ease' }}>
                            <ListItemIcon sx={{ minWidth: 40, color: '#9E9E9E' }}><item.icon fontSize="small" /></ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
                        </ListItemButton>
                    ))} */}

          {[
            { id: "subscriptions", label: "Subscriptions", icon: Receipt },
            { id: "invoices", label: "Invoices", icon: Description },
          ].map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => setActiveView(item.id)}
              sx={{
                borderRadius: 3,
                mb: 1,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#FAFAFA",
                  transform: "translateX(4px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#9E9E9E" }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box
          sx={{
            mt: "auto",
            p: 3,
            borderTop: "1px solid #EDEDED",
            bgcolor: "#FAFAFA",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#FFF3E0",
                color: "#EF6C00",
                border: "1px solid #FFE0B2",
              }}
            >
              <Person fontSize="small" />
            </Avatar>
            <Chip
              label="OWNER PANEL"
              size="small"
              sx={{
                background: "linear-gradient(45deg, #FFB74D 30%, #FFA726 90%)",
                color: "white",
                fontWeight: "800",
                fontSize: "0.65rem",
                height: 22,
                letterSpacing: "0.5px",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ lineHeight: 1.6, mb: 2, fontWeight: 500 }}
          >
            Manage all your client accounts, users and branches from one place.
          </Typography>
          <Button
            startIcon={<PowerSettingsNew />}
            onClick={handleLogout}
            fullWidth
            size="medium"
            sx={{
              textTransform: "none",
              color: "#546E7A",
              justifyContent: "flex-start",
              px: 0,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "transparent",
                color: "#FF5722",
                "& .MuiSvgIcon-root": { color: "#FF5722" },
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
