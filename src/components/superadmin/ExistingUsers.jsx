import React, { useState, useEffect } from 'react';
import { getUsersAPI } from '../../services/api/userAPI';
import {
    Box,
    Typography,
    Chip,
    InputBase,
    Button,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    IconButton,
    CircularProgress
} from '@mui/material';

const ExistingUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 6;

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(page, usersPerPage);
            if (response.success) {
                setUsers(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalCount(response.pagination.total);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const handlePageClick = (page) => {
        if (page !== currentPage) {
            fetchUsers(page);
        }
    };

    const getSubscriptionName = (subscriptionId) => {
        const plans = { 1: 'Basic', 2: 'Pro Plan', 3: 'Enterprise' };
        return plans[subscriptionId] || 'Basic';
    };

    const getPlanColor = (subscriptionId) => {
        if (subscriptionId === 3) return { bg: '#EDE7F6', color: '#673AB7' };
        if (subscriptionId === 2) return { bg: '#E3F2FD', color: '#1976D2' };
        return { bg: '#E8F5E9', color: '#2E7D32' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name.substring(0, 2).toUpperCase();
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <Button
                        key={i}
                        size="small"
                        onClick={() => handlePageClick(i)}
                        sx={{
                            minWidth: 32,
                            height: 32,
                            p: 0,
                            border: currentPage === i ? '1px solid #E0E0E0' : 'none',
                            color: currentPage === i ? '#1A1A1A' : 'text.secondary'
                        }}
                    >
                        {i}
                    </Button>
                );
            }
        } else {
            buttons.push(
                <Button
                    key={1}
                    size="small"
                    onClick={() => handlePageClick(1)}
                    sx={{
                        minWidth: 32,
                        height: 32,
                        p: 0,
                        border: currentPage === 1 ? '1px solid #E0E0E0' : 'none',
                        color: currentPage === 1 ? '#1A1A1A' : 'text.secondary'
                    }}
                >
                    1
                </Button>
            );

            if (currentPage > 3) {
                buttons.push(
                    <Typography key="dots1" variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mx: 0.5 }}>
                        ...
                    </Typography>
                );
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                buttons.push(
                    <Button
                        key={i}
                        size="small"
                        onClick={() => handlePageClick(i)}
                        sx={{
                            minWidth: 32,
                            height: 32,
                            p: 0,
                            border: currentPage === i ? '1px solid #E0E0E0' : 'none',
                            color: currentPage === i ? '#1A1A1A' : 'text.secondary'
                        }}
                    >
                        {i}
                    </Button>
                );
            }

            if (currentPage < totalPages - 2) {
                buttons.push(
                    <Typography key="dots2" variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mx: 0.5 }}>
                        ...
                    </Typography>
                );
            }

            buttons.push(
                <Button
                    key={totalPages}
                    size="small"
                    onClick={() => handlePageClick(totalPages)}
                    sx={{
                        minWidth: 32,
                        height: 32,
                        p: 0,
                        border: currentPage === totalPages ? '1px solid #E0E0E0' : 'none',
                        color: currentPage === totalPages ? '#1A1A1A' : 'text.secondary'
                    }}
                >
                    {totalPages}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">Superadmin / Management</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        Existing Customers <Chip label={`${totalCount} Total`} size="small" sx={{ bgcolor: '#F5F7FA', color: 'text.secondary', ml: 2, fontWeight: 'normal' }} />
                    </Typography>
                </Box>
                <Chip
                    avatar={<Avatar src="https://i.pravatar.cc/150?img=12" sx={{ width: 24, height: 24 }} />}
                    label="Superadmin"
                    variant="outlined"
                    sx={{ borderColor: '#E0E0E0', borderRadius: 2, fontWeight: 600 }}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
                <InputBase
                    placeholder="Search clients, emails, or business names..."
                    sx={{ bgcolor: '#FFFFFF', px: 2, py: 1, borderRadius: 1, fontSize: '0.9rem', flex: 1, border: '1px solid #E0E0E0' }}
                />
                <Button variant="outlined" sx={{ textTransform: 'none', color: '#1A1A1A', borderColor: '#E0E0E0', minWidth: 100 }}>Filter</Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" sx={{ textTransform: 'none', color: '#1A1A1A', borderColor: '#E0E0E0' }}>Export CSV</Button>
                <Button variant="contained" sx={{ bgcolor: '#FF5722', '&:hover': { bgcolor: '#F4511E' }, textTransform: 'none' }}>Add Customer</Button>
            </Box>

            <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F5F7FA' }}>
                                <TableCell padding="checkbox"><Box sx={{ width: 16, height: 16, border: '1px solid #BDBDBD', borderRadius: 0.5 }} /></TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }}>Customer / Business</TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }}>Contact Info</TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }}>Plan</TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }}>Status</TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }}>Joined Date</TableCell>
                                <TableCell sx={{ color: '#757575', fontWeight: 500, bgcolor: '#F9FAFB' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={32} />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((row, index) => {
                                    const planColors = getPlanColor(row.subscription_id);
                                    return (
                                        <TableRow key={row.id} hover>
                                            <TableCell padding="checkbox"><Box sx={{ width: 16, height: 16, border: '1px solid #E0E0E0', borderRadius: 0.5 }} /></TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#E3F2FD', color: '#1976D2', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        {getInitials(row.name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="600">{row.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{row.shop_name}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">{row.email}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{row.phone}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getSubscriptionName(row.subscription_id)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: planColors.bg,
                                                        color: planColors.color,
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        height: 20,
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.is_active ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: row.is_active ? '#E8F5E9' : '#FFEBEE',
                                                        color: row.is_active ? '#2E7D32' : '#C62828',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        height: 20
                                                    }}
                                                    avatar={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', ml: 0.5 }} />}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{formatDate(row.created_at)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small"><span style={{ fontSize: '1.2rem', lineHeight: 0.5, marginBottom: 8 }}>...</span></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Showing {users.length > 0 ? ((currentPage - 1) * usersPerPage + 1) : 0}-{Math.min(currentPage * usersPerPage, totalCount)} of {totalCount} customers
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {renderPaginationButtons()}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ExistingUsers;
