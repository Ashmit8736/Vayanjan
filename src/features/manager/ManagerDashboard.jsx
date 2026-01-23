import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Avatar,
    Drawer,
    useTheme,
    useMediaQuery,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    RestaurantMenu,
    TableBar,
    ReceiptLong,
    Settings,
    Menu as MenuIcon,
    Logout,
    ShoppingCart,
    AttachMoney,
    AccessTime
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

// Placeholder components for different sections
const DashboardHome = () => {
    const stats = [
        { label: 'Total Orders', value: '124', icon: <ShoppingCart sx={{ color: '#fff' }} />, color: '#FF9800' },
        { label: 'Total Sales', value: '₹ 24,500', icon: <AttachMoney sx={{ color: '#fff' }} />, color: '#4CAF50' },
        { label: 'Occupied Tables', value: '8/12', icon: <TableBar sx={{ color: '#fff' }} />, color: '#2196F3' },
        { label: 'Pending KOTs', value: '5', icon: <AccessTime sx={{ color: '#fff' }} />, color: '#F44336' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Dashboard Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Box sx={{
                                    bgcolor: stat.color,
                                    width: 50,
                                    height: 50,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Orders
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F5F5F5' }}>
                        <TableRow>
                            <TableCell><strong>Order ID</strong></TableCell>
                            <TableCell><strong>Table</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Items</strong></TableCell>
                            <TableCell align="right"><strong>Amount</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[101, 102, 103, 104, 105].map((id) => (
                            <TableRow key={id} hover>
                                <TableCell>#{id}</TableCell>
                                <TableCell>T-{id - 90}</TableCell>
                                <TableCell>
                                    <Chip label="Completed" size="small" color="success" variant="outlined" />
                                </TableCell>
                                <TableCell>{id % 2 === 0 ? 'Paneer Butter Masala, Roti' : 'Veg Biryani, Coke'}</TableCell>
                                <TableCell align="right">₹ {id * 15}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

const TablesView = () => <Box sx={{ p: 3 }}><Typography variant="h5">Table Management</Typography></Box>;
const OrdersView = () => <Box sx={{ p: 3 }}><Typography variant="h5">Orders View</Typography></Box>;
const KOTView = () => <Box sx={{ p: 3 }}><Typography variant="h5">Kitchen Order Tickets</Typography></Box>;

const ManagerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/manager/dashboard' },
        { label: 'Tables', icon: <TableBar />, path: '/manager/tables' },
        { label: 'Orders', icon: <ReceiptLong />, path: '/manager/orders' },
        { label: 'KOT', icon: <RestaurantMenu />, path: '/manager/kot' },
        { label: 'Settings', icon: <Settings />, path: '/manager/settings' },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A1A2E', color: 'white' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#FF5722', mr: 2 }}>M</Avatar>
                <Typography variant="h6" fontWeight="bold">Manager Panel</Typography>
            </Box>
            <List sx={{ flexGrow: 1, px: 1 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.label}
                        onClick={() => {
                            navigate(item.path);
                            if (isMobile) setMobileOpen(false);
                        }}
                        sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} sx={{ color: 'white' }} />
                    </ListItemButton>
                ))}
            </List>
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                    fullWidth
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{ color: 'rgba(255,255,255,0.7)', justifyContent: 'flex-start' }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
            <AppBar position="fixed" sx={{
                width: { md: `calc(100% - 240px)` },
                ml: { md: '240px' },
                bgcolor: 'white',
                color: 'text.primary',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {user?.name || 'Manager'}
                    </Typography>
                    <Avatar sx={{ bgcolor: '#FF5722', width: 32, height: 32 }}>
                        {user?.name?.[0] || 'M'}
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderRight: 'none' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` }, mt: 8 }}>
                <Routes>
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardHome />} />
                    <Route path="tables" element={<TablesView />} />
                    <Route path="orders" element={<OrdersView />} />
                    <Route path="kot" element={<KOTView />} />
                    {/* Add other routes here */}
                </Routes>
            </Box>
        </Box>
    );
};

export default ManagerDashboard;
