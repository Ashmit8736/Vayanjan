import React from 'react';
import {
    Box,
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    Fade,
    IconButton
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

const NewBranch = ({ onCancel }) => {
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
                                        <InputField icon={Store} placeholder="e.g. Spice Garden - Sector 14" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>FSSAI / License No.</Typography>
                                        <InputField icon={Badge} placeholder="License Number" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Branch Manager Name</Typography>
                                        <InputField icon={Person} placeholder="Manager's Name" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Branch Email</Typography>
                                        <InputField icon={Email} placeholder="branch@email.com" />
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
                                        <InputField icon={LocationOn} placeholder="Shop No, Building, Street Name" />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>City</Typography>
                                        <InputField icon={LocationOn} placeholder="e.g. Mumbai" />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>State</Typography>
                                        <InputField icon={Map} placeholder="e.g. Maharashtra" />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Pincode</Typography>
                                        <InputField icon={PinDrop} placeholder="400001" type="number" />
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
                                        <InputField icon={Phone} placeholder="+91 98765 43210" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Alternate Number</Typography>
                                        <InputField icon={Phone} placeholder="Landline or secondary number" />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'white', borderTop: '1px solid #EDEDED', mt: 'auto' }}>
                        <Button onClick={onCancel} variant="outlined" sx={{ textTransform: 'none', color: '#546E7A', borderColor: '#CFD8DC', px: 3 }}>Cancel</Button>
                        <Button variant="contained" sx={{ bgcolor: '#009688', '&:hover': { bgcolor: '#00796B' }, textTransform: 'none', px: 4, fontWeight: 600, boxShadow: '0 4px 14px rgba(0, 150, 136, 0.4)' }}>
                            Create Branch
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default NewBranch;
