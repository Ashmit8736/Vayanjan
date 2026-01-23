import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBranchStatsAPI } from '../../services/api/authAPI';
import { getMyBranchesAPI } from '../../services/api/branchAPI';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    CircularProgress
} from '@mui/material';
import {
    Sync,
    Add,
    Store,
    LocalCafe,
    ArrowForward,
    Notifications,
    AccountTree
} from '@mui/icons-material';

const DashboardOverview = ({ onNavigate }) => {
    const { user } = useSelector((state) => state.auth);
    const [branchStats, setBranchStats] = useState({
        limit: 0,
        used: 0,
        loading: true
    });
    const [shops, setShops] = useState([]);
    const [shopsLoading, setShopsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getBranchStatsAPI();
                setBranchStats({
                    limit: response.store_count,
                    used: response.created_branches_count,
                    loading: false
                });
            } catch (error) {
                console.error("Failed to fetch branch stats:", error);
                setBranchStats(prev => ({ ...prev, loading: false }));
            }
        };

        const fetchBranches = async () => {
            try {
                const response = await getMyBranchesAPI();
                if (response && response.success) {
                    const formattedShops = response.data.map(branch => ({
                        id: branch.branch_id,
                        name: branch.branch_name,
                        address: `${branch.address}, ${branch.city}`,
                        type: 'Branch',
                        sub: '', // Can be populated if backend supports sub-branches
                        icon: Store,
                        infoColor: '#E0F2F1',
                        iconColor: '#00695C'
                    }));
                    setShops(formattedShops);
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
            } finally {
                setShopsLoading(false);
            }
        };

        if (user) {
            fetchStats();
            fetchBranches();
        }
    }, [user]);

    // Mock Data
    const metrics = [
        { label: 'Total Revenue (Today)', value: '₹42,500', sub: '', action: '', color: '#FFFFFF', isAlert: false },
        { label: 'Active Orders', value: '18', sub: '', action: '', color: '#FFFFFF', isAlert: false },
        {
            label: 'Total Shops & Branches',
            value: branchStats.loading ? '...' : `${branchStats.used} / ${branchStats.limit}`,
            sub: branchStats.loading ? 'Loading...' : `${branchStats.used} Used, ${branchStats.limit} Limit`,
            action: '',
            icon: Store,
            color: '#FFFFFF',
            isAlert: false
        },
        { label: 'Low Stock Items', value: '7', sub: 'Action needed', action: 'Action needed', color: '#FFFFFF', isAlert: true }
    ];

    const recentUsers = [
        { name: 'Rahul A.', role: 'Billing Clerk', shop: 'Spice Garden', avatarBg: '#E3F2FD', avatarColor: '#1565C0' },
        { name: 'Sneha K.', role: 'Inv. Manager', shop: 'Chai Point', avatarBg: '#FCE4EC', avatarColor: '#C2185B' },
        { name: 'Vikram P.', role: 'Manager', shop: 'Spice Garden', avatarBg: '#E8F5E9', avatarColor: '#2E7D32' }
    ];

    return (
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Top Bar (Breadcrumbs & Global View) */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton size="small" sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Notifications fontSize="small" />
                    </IconButton>

                </Box>
            </Box>

            {/* Welcome Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1A1A1A', mb: 0.5 }}>
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening across your food outlets today.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<Sync />}
                        variant="outlined"
                        sx={{
                            bgcolor: 'white',
                            border: '1px solid #E0E0E0',
                            color: '#424242',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2
                        }}
                    >
                        Sync Data
                    </Button>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        onClick={() => {
                            if (branchStats.loading) {
                                alert("Please wait, fetching subscription details...");
                                return;
                            }

                            const remaining = branchStats.limit - branchStats.used;

                            // Check: Agar remaining space 1 se kam hai, toh block karo
                            if (remaining < 1) {
                                alert(`Please upgrade your plan to create new branch. Limit: ${branchStats.limit}, Used: ${branchStats.used}`);
                                return;
                            }
                            onNavigate('newBranch');
                        }}
                        sx={{
                            bgcolor: '#009688',
                            '&:hover': { bgcolor: '#00796B' },
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            boxShadow: '0 4px 12px rgba(0, 150, 136, 0.3)'
                        }}
                    >
                        Create New Shop
                    </Button>
                </Box>
            </Box>

            {/* Metrics Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {metrics.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                bgcolor: item.color,
                                borderRadius: 3,
                                border: '1px solid #F0F0F0',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                height: 160,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" fontWeight="600" sx={{ mb: 1 }}>
                                    {item.label}
                                </Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1A1A1A' }}>
                                    {item.value}
                                </Typography>
                            </Box>

                            {(item.sub || item.isAlert) && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.icon === Store && <Store fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />}
                                    <Typography
                                        variant="caption"
                                        fontWeight="600"
                                        sx={{
                                            color: item.isAlert ? '#F44336' : 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        {item.isAlert && <Box component="span" sx={{ fontSize: 16 }}>⊙</Box>}
                                        {item.isAlert ? item.action : item.sub}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Bottom Section: Shops & Users */}
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                {/* Your Shops */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid #F0F0F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="700">Your Shops</Typography>
                        </Box>

                        <List sx={{ p: 0, maxHeight: 310, overflowY: 'auto' }}>
                            {shopsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={30} />
                                </Box>
                            ) : shops.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No shops found. Create one to get started.</Typography>
                                </Box>
                            ) : (
                                shops.map((shop, index) => (
                                    <ListItem
                                        key={shop.id}
                                        sx={{
                                            p: 3,
                                            borderBottom: index !== shops.length - 1 ? '1px solid #F5F5F5' : 'none',
                                            flexWrap: 'wrap',
                                            gap: 2
                                        }}
                                    >
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: shop.infoColor,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: shop.iconColor,
                                            mr: 2
                                        }}>
                                            <shop.icon />
                                        </Box>

                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>{shop.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{shop.address}</Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip label={shop.type} size="small" sx={{ borderRadius: 1, bgcolor: '#F5F7FA', fontWeight: 600, fontSize: '0.7rem' }} />
                                                {shop.sub && <Chip label={shop.sub} size="small" sx={{ borderRadius: 1, bgcolor: '#F5F7FA', fontWeight: 600, fontSize: '0.7rem' }} />}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                startIcon={<AccountTree />}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#424242',
                                                    borderColor: '#E0E0E0',
                                                    borderRadius: 2,
                                                    minHeight: 36
                                                }}
                                            >
                                                Add Branch
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#009688',
                                                    borderColor: '#E0F2F1',
                                                    bgcolor: '#E0F2F1',
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    minHeight: 36,
                                                    border: 'none',
                                                    '&:hover': { bgcolor: '#B2DFDB', border: 'none' }
                                                }}
                                            >
                                                Manage
                                            </Button>
                                        </Box>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Users */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid #F0F0F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #F5F5F5' }}>
                            <Typography variant="h6" fontWeight="700">Recent Users</Typography>
                            <Typography variant="caption" color="text.secondary">Manage branch permissions</Typography>
                        </Box>

                        <List sx={{ p: 2 }}>
                            {recentUsers.map((user, index) => (
                                <ListItem key={index} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: '#F9FAFB' } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: user.avatarBg, color: user.avatarColor, fontWeight: 700, fontSize: '0.8rem' }}>
                                            {user.name.split(' ')[0][0]}{user.name.split(' ')[1][0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2" fontWeight="700">{user.name}</Typography>}
                                        secondary={<Typography variant="caption" color="text.secondary">{user.role}</Typography>}
                                    />
                                    <Chip
                                        label={user.shop}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 1,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            borderColor: '#E0E0E0',
                                            bg: 'white'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ p: 2, borderTop: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardOverview;
