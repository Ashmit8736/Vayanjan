import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    Fade,
    IconButton,
    Alert,
    MenuItem,
    Select,
    CircularProgress
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Lock,
    Store,
    Work,
    ArrowBack
} from '@mui/icons-material';
import { InputField, SectionHeader } from './FormComponents';
import { getMyBranchesAPI } from '../../services/api/branchAPI';
import { createBranchUserAPI } from '../../services/api/userAPI';
import { Snackbar } from '@mui/material';

const AddBranchUser = ({ onCancel }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        branch_id: '',
        role: 'billing'
    });

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await getMyBranchesAPI();
            // Interceptor returns response.data directly
            if (response && response.success) {
                console.log("Setting branches:", response.data);
                setBranches(response.data);
            } else {
                console.warn("Branches API returned success false or no data", response);
            }
        } catch (err) {
            console.error("Failed to fetch branches", err);
            setError("Failed to load branches. Please try again.");
        } finally {
            setPageLoading(false);
        }
    };

    const handleFieldChange = (name) => (e) => {
        setFormData(prev => ({ ...prev, [name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError(null);
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.branch_id || !formData.role) {
            setError("Please fill in all required fields (*)");
            return;
        }

        setLoading(true);
        try {
            await createBranchUserAPI(formData);
            setSuccessOpen(true);
            setTimeout(() => {
                onCancel();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in={true} timeout={400}>
            <Box sx={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 3 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={onCancel} sx={{ mr: 2, bgcolor: 'white', border: '1px solid #E0E0E0' }}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#1A1A1A' }}>
                            Add New User
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a new staff account for a branch
                        </Typography>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Snackbar
                    open={successOpen}
                    autoHideDuration={2000}
                    onClose={() => setSuccessOpen(false)}
                    message="User created successfully!"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />

                {/* Main Form Content */}
                <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#FAFAFA', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>

                    {pageLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={4}>

                                {/* User Info */}
                                <Grid item xs={12}>
                                    <SectionHeader title="User Information" />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Full Name *</Typography>
                                            <InputField
                                                icon={Person}
                                                placeholder="e.g. Rahul Verma"
                                                value={formData.name}
                                                onChange={handleFieldChange('name')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Email Address *</Typography>
                                            <InputField
                                                icon={Email}
                                                placeholder="staff@restaurant.com"
                                                value={formData.email}
                                                onChange={handleFieldChange('email')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Phone Number *</Typography>
                                            <InputField
                                                icon={Phone}
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={handleFieldChange('phone')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Password *</Typography>
                                            <InputField
                                                icon={Lock}
                                                placeholder="Create a password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleFieldChange('password')}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                                {/* Assignment */}
                                <Grid item xs={12}>
                                    <SectionHeader title="Assignment & Role" />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Assign Branch *</Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', bgcolor: 'white',
                                                border: '1px solid #E0E0E0', borderRadius: 2, px: 2, py: 0.5
                                            }}>
                                                <Store sx={{ color: 'text.secondary', mr: 1.5, fontSize: '1.2rem' }} />
                                                <Select
                                                    fullWidth
                                                    variant="standard"
                                                    disableUnderline
                                                    value={formData.branch_id}
                                                    onChange={handleFieldChange('branch_id')}
                                                    displayEmpty
                                                    sx={{ fontSize: '0.9rem' }}
                                                >
                                                    <MenuItem value="" disabled>Select Branch</MenuItem>
                                                    {branches.map(branch => (
                                                        <MenuItem key={branch.branch_id} value={branch.branch_id}>
                                                            {branch.branch_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>User Role *</Typography>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', bgcolor: 'white',
                                                border: '1px solid #E0E0E0', borderRadius: 2, px: 2, py: 0.5
                                            }}>
                                                <Work sx={{ color: 'text.secondary', mr: 1.5, fontSize: '1.2rem' }} />
                                                <Select
                                                    fullWidth
                                                    variant="standard"
                                                    disableUnderline
                                                    value={formData.role}
                                                    onChange={handleFieldChange('role')}
                                                    sx={{ fontSize: '0.9rem' }}
                                                >
                                                    <MenuItem value="billing">Billing</MenuItem>
                                                    <MenuItem value="inventory">Inventory</MenuItem>
                                                    <MenuItem value="both">Both</MenuItem>
                                                </Select>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Box>
                    )}

                    {/* Footer */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'white', borderTop: '1px solid #EDEDED', mt: 'auto' }}>
                        <Button onClick={onCancel} disabled={loading} variant="outlined" sx={{ textTransform: 'none', color: '#546E7A', borderColor: '#CFD8DC', px: 3 }}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            variant="contained"
                            sx={{ bgcolor: '#009688', '&:hover': { bgcolor: '#00796B' }, textTransform: 'none', px: 4, fontWeight: 600, boxShadow: '0 4px 14px rgba(0, 150, 136, 0.4)' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default AddBranchUser;
