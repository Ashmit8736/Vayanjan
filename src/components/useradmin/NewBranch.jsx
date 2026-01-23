import React, { useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import {
    Store,
    Badge,
    Person,
    LocationOn,
    Map,
    PinDrop,
    Phone,
    Email,
    ArrowBack
} from '@mui/icons-material';
import { InputField, SectionHeader } from './FormComponents';
import { createBranchAPI } from '../../services/api/branchAPI';
import { Snackbar } from '@mui/material';

const NewBranch = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        branch_name: '',
        license_no: '',
        gst_no: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        primary_no: '',
        secondary_no: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target || {}; // Handle cases where event might be wrapped differently if InputField changes
        // Assuming InputField passes standard event or we adjust InputField to pass name
        // Checking InputField implementation: it renders InputBase with onChange={onChange}.
        // So validation: we need to pass 'name' to InputField or handle it in the wrapper.
        // Actually InputField doesn't take 'name' prop in the current version shown in previous turn.
        // I will update InputField usage to pass individual handlers or wrap it.
        // Better: I will update key logic below.
    };

    // Improved handler for specific fields since InputField might not propagate 'name' correctly if not passed
    const handleFieldChange = (name) => (e) => {
        setFormData(prev => ({ ...prev, [name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError(null);
        if (!formData.branch_name || !formData.address || !formData.primary_no) {
            setError("Please fill in all required fields (*)");
            return;
        }

        setLoading(true);
        try {
            await createBranchAPI(formData);
            setSuccessOpen(true);
            setTimeout(() => {
                onCancel(); // Return to dashboard after success
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create branch. Please try again.");
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
                            Add New Branch
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Expand your business by adding a new outlet
                        </Typography>
                    </Box>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Success Snackbar */}
                <Snackbar
                    open={successOpen}
                    autoHideDuration={2000}
                    onClose={() => setSuccessOpen(false)}
                    message="Branch created successfully!"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />

                {/* Main Form Content */}
                <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#FAFAFA', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>

                            {/* Branch Info */}
                            <Grid item xs={12}>
                                <SectionHeader title="Branch Information" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Branch Name *</Typography>
                                        <InputField
                                            icon={Store}
                                            placeholder="e.g. Spice Garden - Sector 14"
                                            value={formData.branch_name}
                                            onChange={handleFieldChange('branch_name')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>FSSAI / License No.</Typography>
                                        <InputField
                                            icon={Badge}
                                            placeholder="License Number"
                                            value={formData.license_no}
                                            onChange={handleFieldChange('license_no')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>GST Number</Typography>
                                        <InputField
                                            icon={Badge}
                                            placeholder="GST Number"
                                            value={formData.gst_no}
                                            onChange={handleFieldChange('gst_no')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Branch Email</Typography>
                                        <InputField
                                            icon={Email}
                                            placeholder="branch@email.com"
                                            value={formData.email}
                                            onChange={handleFieldChange('email')}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                            {/* Location Details */}
                            <Grid item xs={12}>
                                <SectionHeader title="Location Details" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Complete Address *</Typography>
                                        <InputField
                                            icon={LocationOn}
                                            placeholder="Shop No, Building, Street Name"
                                            value={formData.address}
                                            onChange={handleFieldChange('address')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>City</Typography>
                                        <InputField
                                            icon={LocationOn}
                                            placeholder="e.g. Mumbai"
                                            value={formData.city}
                                            onChange={handleFieldChange('city')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>State</Typography>
                                        <InputField
                                            icon={Map}
                                            placeholder="e.g. Maharashtra"
                                            value={formData.state}
                                            onChange={handleFieldChange('state')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Pincode</Typography>
                                        <InputField
                                            icon={PinDrop}
                                            placeholder="400001"
                                            type="number"
                                            value={formData.pincode}
                                            onChange={handleFieldChange('pincode')}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                            {/* Contact Info */}
                            <Grid item xs={12}>
                                <SectionHeader title="Contact Configuration" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Contact Number *</Typography>
                                        <InputField
                                            icon={Phone}
                                            placeholder="+91 98765 43210"
                                            value={formData.primary_no}
                                            onChange={handleFieldChange('primary_no')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Alternate Number</Typography>
                                        <InputField
                                            icon={Phone}
                                            placeholder="Landline or secondary number"
                                            value={formData.secondary_no}
                                            onChange={handleFieldChange('secondary_no')}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'white', borderTop: '1px solid #EDEDED', mt: 'auto' }}>
                        <Button onClick={onCancel} disabled={loading} variant="outlined" sx={{ textTransform: 'none', color: '#546E7A', borderColor: '#CFD8DC', px: 3 }}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            variant="contained"
                            sx={{ bgcolor: '#009688', '&:hover': { bgcolor: '#00796B' }, textTransform: 'none', px: 4, fontWeight: 600, boxShadow: '0 4px 14px rgba(0, 150, 136, 0.4)' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Branch'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default NewBranch;
