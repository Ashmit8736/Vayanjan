import React from 'react';
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
    IconButton
} from '@mui/material';

const ExistingUsers = () => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">Superadmin / Management</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        Existing Customers <Chip label="1,248 Total" size="small" sx={{ bgcolor: '#F5F7FA', color: 'text.secondary', ml: 2, fontWeight: 'normal' }} />
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
                            {[
                                { name: 'Rajesh Kumar', business: 'Spice Garden Pvt Ltd', email: 'rajesh@spicegarden.com', phone: '+91 98765 43210', plan: 'Enterprise', status: 'Active', joined: 'Jan 12, 2024', img: 'https://i.pravatar.cc/150?img=11' },
                                { name: 'Priya Sharma', business: 'The Chai Spot', email: 'priya@chaispot.in', phone: '+91 99887 76655', plan: 'Pro Plan', status: 'Active', joined: 'Dec 05, 2023', img: 'https://i.pravatar.cc/150?img=5' },
                                { name: 'Vikram Singh', business: 'Royal Tandoor', email: 'vikram@royaltandoor.com', phone: '+91 88776 65544', plan: 'Basic', status: 'Payment Due', joined: 'Nov 20, 2023', img: 'https://i.pravatar.cc/150?img=8', statusColor: 'warning' },
                                { name: 'Anita Desai', business: 'Desai Sweets & Snacks', email: 'anita.d@gmail.com', phone: '+91 77665 54433', plan: 'Basic', status: 'Suspended', joined: 'Feb 01, 2024', img: 'https://i.pravatar.cc/150?img=9', statusColor: 'error' },
                                { name: 'Arjun Mehta', business: 'Burger Point Franchise', email: 'arjun@burgerpoint.in', phone: '+91 66554 43322', plan: 'Pro Plan', status: 'Active', joined: 'Jan 25, 2024', img: 'https://i.pravatar.cc/150?img=3' },
                            ].map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell padding="checkbox"><Box sx={{ width: 16, height: 16, border: '1px solid #E0E0E0', borderRadius: 0.5 }} /></TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar src={row.img} sx={{ width: 32, height: 32, mr: 2 }} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="600">{row.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{row.business}</Typography>
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
                                        <Chip label={row.plan} size="small" sx={{ bgcolor: row.plan === 'Enterprise' ? '#EDE7F6' : '#E3F2FD', color: row.plan === 'Enterprise' ? '#673AB7' : '#1976D2', fontWeight: 600, fontSize: '0.7rem', height: 20, borderRadius: 1 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            sx={{
                                                bgcolor: row.status === 'Active' ? '#E8F5E9' : (row.status === 'Suspended' ? '#FFEBEE' : '#FFF3E0'),
                                                color: row.status === 'Active' ? '#2E7D32' : (row.status === 'Suspended' ? '#C62828' : '#EF6C00'),
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                height: 20
                                            }}
                                            avatar={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', ml: 0.5 }} />}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.joined}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><span style={{ fontSize: '1.2rem', lineHeight: 0.5, marginBottom: 8 }}>...</span></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Showing 1-5 of 1,248 customers</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" sx={{ minWidth: 32, height: 32, p: 0, border: '1px solid #E0E0E0', color: '#1A1A1A' }}>1</Button>
                        <Button size="small" sx={{ minWidth: 32, height: 32, p: 0, color: 'text.secondary' }}>2</Button>
                        <Button size="small" sx={{ minWidth: 32, height: 32, p: 0, color: 'text.secondary' }}>3</Button>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mx: 0.5 }}>...</Typography>
                        <Button size="small" sx={{ minWidth: 32, height: 32, p: 0, color: 'text.secondary' }}>24</Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ExistingUsers;
