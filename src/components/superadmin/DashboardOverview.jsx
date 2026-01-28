import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    List,
    ListItem,
    Avatar,
    ListItemText
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Settings } from '@mui/icons-material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton
} from '@mui/material';


const data = [
    { name: 'Aug', uv: 2000 },
    { name: 'Sep', uv: 3000 },
    { name: 'Oct', uv: 2500 },
    { name: 'Nov', uv: 4000 },
    { name: 'Dec', uv: 5000 },
    { name: 'Jan', uv: 6500 },
];

const recentOnboardings = [
    { name: "Priya's Kitchen", plan: 'Premium Plan • 3 Branches', time: 'Just now', img: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Tandoor Tales', plan: 'Basic Plan • 1 Branch', time: '2h ago', img: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Burger Point', plan: 'Pro Plan • 5 Branches', time: '5h ago', img: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Chai Sutta Bar', plan: 'Basic Plan • 1 Branch', time: '1d ago', img: 'https://i.pravatar.cc/150?img=9' },
];

const clientBilling = [
    { name: 'Suresh Khanna', business: 'Khanna Sweets', plan: 'Enterprise', amount: '₹24,000', due: 'Tomorrow', status: 'Pending', color: 'warning' },
    { name: 'Anjali Mehta', business: 'Cafe Coffee Day (Franchise)', plan: 'Pro Plan', amount: '₹12,000', due: 'In 2 days', status: 'Auto-Debit', color: 'success' },
    { name: 'Rahul Jain', business: 'Pizza Castle', plan: 'Basic', amount: '₹4,500', due: 'In 3 days', status: 'Pending', color: 'warning' },
];

import { getUsersAPI } from '../../services/api/userAPI';

const DashboardOverview = () => {
    const [totalClients, setTotalClients] = useState('...');
    const [clientGrowth, setClientGrowth] = useState('...');
    const [activeRestaurants, setActiveRestaurants] = useState('...');
    const [outletGrowth, setOutletGrowth] = useState('...');

    useEffect(() => {
        const fetchClientCount = async () => {
            try {
                // Fetch a large number to calculate growth locally
                const response = await getUsersAPI({ page: 1, limit: 1000 });
                if (response.success && response.pagination) {
                    const total = response.pagination.total;
                    setTotalClients(total);

                    const users = response.data;
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    let totalStores = 0;
                    let usersThisMonth = 0;
                    let storesThisMonth = 0;

                    users.forEach(user => {
                        const userDate = new Date(user.created_at);
                        const isThisMonth = userDate.getMonth() === currentMonth &&
                            userDate.getFullYear() === currentYear;

                        if (isThisMonth) {
                            usersThisMonth++;
                        }

                        if (user.store_count) {
                            const count = Number(user.store_count);
                            totalStores += count;
                            if (isThisMonth) {
                                storesThisMonth += count;
                            }
                        }
                    });

                    setActiveRestaurants(totalStores);

                    // Client Growth
                    const previousMonthUsers = total - usersThisMonth;
                    let cGrowth = 0;
                    if (previousMonthUsers > 0) {
                        cGrowth = ((usersThisMonth / previousMonthUsers) * 100).toFixed(1);
                    } else if (usersThisMonth > 0) {
                        cGrowth = 100;
                    }
                    setClientGrowth(`+${cGrowth}% this month`);

                    // Outlet Growth
                    const previousMonthStores = totalStores - storesThisMonth;
                    let oGrowth = 0;
                    if (previousMonthStores > 0) {
                        oGrowth = ((storesThisMonth / previousMonthStores) * 100).toFixed(1);
                    } else if (storesThisMonth > 0) {
                        oGrowth = 100;
                    }
                    setOutletGrowth(`+${oGrowth}% new outlets`);

                }
            } catch (error) {
                console.error("Failed to fetch client count:", error);
                setTotalClients('0');
                setClientGrowth('0% this month');
                setActiveRestaurants('0');
                setOutletGrowth('0% new outlets');
            }
        };
        fetchClientCount();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', p: 1.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Grid container spacing={2} sx={{ mb: 1.5, flexShrink: 0 }}>
                {[
                    { title: 'Total Clients', value: totalClients, change: clientGrowth, color: '#E3F2FD', text: '#1976D2' },
                    { title: 'Active Restaurants', value: activeRestaurants, change: outletGrowth, color: '#E8F5E9', text: '#2E7D32' },
                    { title: 'Monthly Revenue', value: '₹42.5L', change: '+18% vs last month', color: '#F3E5F5', text: '#7B1FA2' },
                    { title: 'Expiring Licenses', value: '24', change: 'Action required', color: '#FFF3E0', text: '#E65100', isAlert: true },
                ].map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: stat.color,
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px -6px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="body2" color={stat.text} sx={{ opacity: 0.8, fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>{stat.title}</Typography>
                                <Typography variant="h5" fontWeight="800" color={stat.text} sx={{ mb: 0.5, letterSpacing: '-0.5px' }}>{stat.value}</Typography>
                                <Typography variant="caption" fontWeight="700" color={stat.isAlert ? 'error' : stat.text} sx={{ opacity: 0.9, bgcolor: 'rgba(255,255,255,0.4)', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.65rem' }}>
                                    {stat.change}
                                </Typography>
                            </Box>
                            <Box sx={{ position: 'absolute', right: -15, top: -15, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section - Limited Height */}
            <Box sx={{ flex: '0 1 auto', height: '35%', minHeight: 180, mb: 1.5, display: 'flex', gap: 2 }}>
                <Paper elevation={0} sx={{ flex: 2, p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', border: '1px solid #F0F0F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="800">Revenue</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight="500">6 months</Typography>
                        </Box>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: '#757575', borderColor: '#E0E0E0', borderRadius: 2, height: 22, fontSize: '0.7rem', minWidth: 'auto', px: 1, '&:hover': { borderColor: '#BDBDBD', bgcolor: '#F5F5F5' } }}>Filter</Button>
                    </Box>
                    <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF5722" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#FF8A65" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9E9E9E', fontWeight: 500 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9E9E9E', fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ fill: '#F5F7FA' }}
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '6px' }}
                                />
                                <Bar dataKey="uv" radius={[3, 3, 3, 3]} barSize={24} animationDuration={1000}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === data.length - 1 ? 'url(#colorGradient)' : '#EFF1F5'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', border: '1px solid #F0F0F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="800">New Clients</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight="500">Recent</Typography>
                        </Box>
                    </Box>
                    <List sx={{ overflow: 'auto', flexGrow: 1, px: 0 }}>
                        {recentOnboardings.map((item, index) => (
                            <ListItem key={index} disablePadding sx={{ mb: 1, py: 0.5 }}>
                                <Avatar src={item.img} variant="rounded" sx={{ mr: 1.5, width: 32, height: 32, borderRadius: 2 }} />
                                <ListItemText
                                    primary={<Typography variant="subtitle2" fontWeight="700" fontSize="0.8rem" noWrap>{item.name}</Typography>}
                                    secondary={<Typography variant="caption" color="text.secondary" fontWeight="500" noWrap>{item.plan}</Typography>}
                                />
                                <Box sx={{ textAlign: 'right', minWidth: 40 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600" fontSize="0.65rem">{item.time}</Typography>
                                    <Box sx={{ width: 6, height: 6, bgcolor: '#00C853', borderRadius: '50%', display: 'inline-block', mt: 0.5 }} />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* Table Section - Take Remaining Space */}
            <Paper elevation={0} sx={{ flex: 1, minHeight: 0, p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Client Billing</Typography>
                        <Typography variant="caption" color="text.secondary">Renewals</Typography>
                    </Box>
                    <Box>
                        <Button size="small" variant="contained" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 'none', border: '1px solid #E0E0E0', '&:hover': { bgcolor: '#F5F5F5' }, mr: 1, fontSize: '0.65rem', height: 22, minWidth: 'auto', px: 1 }}>Upcoming</Button>
                    </Box>
                </Box>
                <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5, pl: 1 }}>Client</TableCell>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5 }}>Plan</TableCell>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5 }}>Amount</TableCell>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5 }}>Due</TableCell>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5 }}>Status</TableCell>
                                <TableCell sx={{ color: '#9E9E9E', fontWeight: 600, fontSize: '0.7rem', py: 0.5 }} align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientBilling.map((row, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 0.5, pl: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: row.color === 'warning' ? '#FFF3E0' : '#FFEBEE', color: row.color === 'warning' ? '#FF9800' : '#F44336', mr: 1, width: 24, height: 24, fontSize: '0.6rem', fontWeight: 'bold' }}>
                                                {row.name.charAt(0)}{row.name.split(' ')[1].charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="600" fontSize="0.75rem" noWrap>{row.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontSize="0.65rem" noWrap>{row.business}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 0.5 }}>
                                        <Chip label={row.plan} size="small" sx={{ bgcolor: '#F5F7FA', fontWeight: 600, color: '#546E7A', height: 18, fontSize: '0.6rem' }} />
                                    </TableCell>
                                    <TableCell fontWeight="bold" sx={{ py: 0.5, fontSize: '0.75rem' }}>{row.amount}</TableCell>
                                    <TableCell sx={{ py: 0.5, fontSize: '0.75rem' }}>{row.due}</TableCell>
                                    <TableCell sx={{ py: 0.5 }}>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            sx={{
                                                bgcolor: row.status === 'Pending' ? '#FFF3E0' : '#E8F5E9',
                                                color: row.status === 'Pending' ? '#E65100' : '#2E7D32',
                                                fontWeight: 'bold',
                                                height: 18,
                                                fontSize: '0.6rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 0.5 }}>
                                        <IconButton size="small" sx={{ p: 0.5 }}><Settings sx={{ fontSize: '1rem' }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default DashboardOverview;
