import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Button,
    Fade,
    Drawer,
    IconButton,
    useTheme,
    useMediaQuery,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Store,
    Group,
    Inventory as InventoryIcon,
    History,
    Assessment,
    PowerSettingsNew,
    Person,
    Logout,
    Menu as MenuIcon,
    ConfirmationNumber as ConfirmationNumberIcon
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice'; // Fixed path if needed, assuming alias or relative

import DashboardOverview from '../../components/useradmin/DashboardOverview';
import NewBranch from '../../components/useradmin/NewBranch'; // Import NewBranch
import Inventory from '../../components/useradmin/Inventory';
import UserManagement from '../../components/useradmin/UserManagement';
import TokenReports from '../tokens/TokenReports';

const UserAdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeView, setActiveView] = React.useState('dashboard');
    const { user } = useSelector((state) => state.auth);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        if (window.electronAPI) {
            window.electronAPI.logout();
        }
        navigate('/login');
    };

    const renderContent = () => {
        let content;
        switch (activeView) {
            case 'newBranch': // Handle new branch view
                content = <NewBranch onCancel={() => setActiveView('dashboard')} />;
                break;

            case 'inventory':
                content = <Inventory />;
                break;

            case 'users':
                content = <UserManagement />;
                break;

            case 'tokens':
                content = <TokenReports />;
                break;

            case 'dashboard':
            default:
                content = <DashboardOverview onNavigate={setActiveView} />; // Pass navigation handler
                break;
        }
        return (
            <Fade in={true} timeout={400} key={activeView}>
                <Box sx={{ height: '100%', overflow: 'hidden' }}>
                    {content}
                </Box>
            </Fade>
        );
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'myshops', label: 'My Shops', icon: Store },
        { id: 'users', label: 'User Management', icon: Group },
        { id: 'inventory', label: 'Inventory', icon: InventoryIcon },
        { id: 'tokens', label: 'Tokens', icon: ConfirmationNumberIcon },
        { id: 'billing', label: 'Billing History', icon: History },
        { id: 'reports', label: 'Reports', icon: Assessment }
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: '#009688', borderRadius: 2, width: 36, height: 36, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 150, 136, 0.3)' }}>
                    <Store sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight="800" sx={{ color: '#1A1A1A' }}>
                    Vyanjan
                </Typography>
            </Box>

            <List sx={{ px: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.id}
                        selected={activeView === item.id}
                        onClick={() => {
                            setActiveView(item.id);
                            if (isMobile) setMobileOpen(false);
                        }}
                        sx={{
                            borderRadius: 3,
                            mb: 1,
                            py: 1.5,
                            transition: 'all 0.3s ease',
                            '&.Mui-selected': {
                                bgcolor: '#E0F2F1',
                                color: '#00695C',
                                '& .MuiListItemIcon-root': { color: '#00897B' }
                            },
                            '&:hover': {
                                bgcolor: activeView === item.id ? '#B2DFDB' : '#FAFAFA',
                                transform: 'translateX(4px)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: '#9E9E9E', transition: 'color 0.3s' }}>
                            <item.icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontWeight: activeView === item.id ? 700 : 500,
                                fontSize: '0.95rem'
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ mt: 'auto', p: 3, borderTop: '1px solid #EDEDED', bgcolor: '#FAFAFA' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                    <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 40, height: 40, border: '2px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                    <Box>
                        <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2 }}>{user?.name || 'User'}</Typography>
                        <Typography variant="caption" color="text.secondary">Owner</Typography>
                    </Box>
                </Box>
                <Button
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    fullWidth
                    size="medium"
                    sx={{
                        textTransform: 'none',
                        color: '#546E7A',
                        justifyContent: 'flex-start',
                        px: 1,
                        mt: 1,
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: 'transparent',
                            color: '#FF5722',
                            '& .MuiSvgIcon-root': { color: '#FF5722' }
                        }
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F5F7FA' }}>
            {/* AppBar for Mobile */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: { md: `calc(100% - 260px)` },
                        ml: { md: '260px' },
                        bgcolor: 'white',
                        color: 'text.primary',
                        boxShadow: 'none',
                        borderBottom: '1px solid #EDEDED',
                        zIndex: theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ bgcolor: '#009688', borderRadius: 1, width: 28, height: 28, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Store sx={{ color: 'white', fontSize: 16 }} />
                            </Box>
                            <Typography variant="h6" noWrap component="div" fontWeight="800">
                                Vyanjan
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: 260 }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, borderRight: '1px solid #EDEDED' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', pt: isMobile ? 8 : 0 }}>
                {renderContent()}
            </Box>
        </Box>
    );
};

export default UserAdminDashboard;
