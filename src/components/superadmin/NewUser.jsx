import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    InputBase,
    Button,
    Chip,
    Avatar,
    Fade,
    Switch,
    FormControlLabel,
    MenuItem,
    Select,
    Divider
} from '@mui/material';
import {
    Search,
    Person,
    Email,
    Phone,
    Store,
    Badge,
    LocationOn,
    ConfirmationNumber,
    ReceiptLong
} from '@mui/icons-material';

const NewUser = () => {
    const [isMultiBranch, setIsMultiBranch] = useState(false);
    const [plan, setPlan] = useState('premium');

    const InputField = ({ icon: Icon, placeholder, disabled, type = "text", value, onChange }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: disabled ? '#F5F5F5' : '#FFFFFF',
            border: '1px solid #E0E0E0',
            borderRadius: 2,
            px: 2,
            py: 0.8,
            transition: 'all 0.2s',
            '&:hover': { borderColor: disabled ? '#E0E0E0' : '#BDBDBD' },
            '&:focus-within': {
                borderColor: '#FF5722',
                boxShadow: '0 4px 12px rgba(255, 87, 34, 0.05)'
            }
        }}>
            <Icon sx={{ color: 'text.secondary', mr: 1.5, fontSize: '1.2rem' }} />
            <InputBase
                placeholder={placeholder}
                fullWidth
                disabled={disabled}
                type={type}
                value={value}
                onChange={onChange}
                sx={{ fontSize: '0.9rem', color: '#1A1A1A' }}
            />
        </Box>
    );

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{ p: 3, bgcolor: '#FFFFFF', flexGrow: 1, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Superadmin / Users</Typography>
                        <Typography variant="h6" fontWeight="bold">
                            Client user management
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InputBase
                            placeholder="Search client..."
                            sx={{ bgcolor: '#F5F7FA', px: 2, py: 0.5, borderRadius: 1, fontSize: '0.85rem', width: 240, border: '1px solid #E0E0E0' }}
                            startAdornment={<Search fontSize="small" sx={{ color: 'text.secondary', mr: 1, fontSize: '1.2rem' }} />}
                        />
                        <Chip
                            avatar={<Avatar src="https://i.pravatar.cc/150?img=12" sx={{ width: 24, height: 24 }} />}
                            label="Superadmin"
                            variant="outlined"
                            sx={{ borderColor: '#E0E0E0', borderRadius: 2, fontWeight: 600 }}
                        />
                    </Box>
                </Box>

                {/* Main Form Area */}
                <Paper elevation={0} variant="outlined" sx={{ p: 0, borderRadius: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#FAFAFA' }}>

                    {/* Action Bar */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #EDEDED', display: 'flex', justifyContent: 'space-between', bgcolor: 'white', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">Create New Connection</Typography>
                            <Typography variant="caption" color="text.secondary">Onboard a new business owner</Typography>
                        </Box>
                        <Box>
                            <Button size="small" variant="contained" sx={{ bgcolor: '#FFF3E0', color: '#EF6C00', boxShadow: 'none', border: '1px solid #FFE0B2', '&:hover': { bgcolor: '#FFE0B2' }, mr: 1, textTransform: 'none', fontWeight: 600 }}>Manual Entry</Button>
                            <Button size="small" variant="outlined" sx={{ color: 'text.secondary', borderColor: '#E0E0E0', textTransform: 'none' }}>Bulk Import</Button>
                        </Box>
                    </Box>

                    {/* Scrollable Content */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
                        <Grid container spacing={3}>

                            {/* Section 1: Business Details */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ mb: 2, letterSpacing: '0.5px', fontSize: '0.75rem' }}>BUSINESS INFORMATION</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Shop/Restaurant Name *</Typography>
                                        <InputField icon={Store} placeholder="e.g. Spice Hub - Andheri" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>GSTIN / Tax ID</Typography>
                                        <InputField icon={ReceiptLong} placeholder="27AAPFU0939F1Z5" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>City</Typography>
                                        <InputField icon={LocationOn} placeholder="e.g. Mumbai" />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Client ID</Typography>
                                        <InputField icon={Badge} placeholder="Auto-generated" disabled />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                            {/* Section 2: Owner Details */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ mb: 2, letterSpacing: '0.5px', fontSize: '0.75rem' }}>OWNER DETAILS</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Full Name *</Typography>
                                        <InputField icon={Person} placeholder="e.g. Rajesh Kumar" />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Email Address *</Typography>
                                        <InputField icon={Email} placeholder="owner@business.com" />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Mobile Number *</Typography>
                                        <InputField icon={Phone} placeholder="+91 98765 43210" />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}><Divider sx={{ borderStyle: 'dashed' }} /></Grid>

                            {/* Section 3: Configuration */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="800" color="text.secondary" sx={{ mb: 2, letterSpacing: '0.5px', fontSize: '0.75rem' }}>CONFIGURATION & PLAN</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block' }}>Subscription Plan</Typography>
                                        <Select
                                            value={plan}
                                            onChange={(e) => setPlan(e.target.value)}
                                            fullWidth
                                            size="small"
                                            displayEmpty
                                            sx={{
                                                bgcolor: 'white',
                                                fontSize: '0.9rem',
                                                '& .MuiSelect-select': { display: 'flex', alignItems: 'center', py: 1 },
                                                '& fieldset': { borderColor: '#E0E0E0' }
                                            }}
                                        >
                                            <MenuItem value="basic"><ConfirmationNumber sx={{ fontSize: 18, mr: 1, color: '#9E9E9E' }} /> Basic Plan</MenuItem>
                                            <MenuItem value="pro"><ConfirmationNumber sx={{ fontSize: 18, mr: 1, color: '#1976D2' }} /> Pro Plan</MenuItem>
                                            <MenuItem value="premium"><ConfirmationNumber sx={{ fontSize: 18, mr: 1, color: '#FF5722' }} /> Premium Plan</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 2.5 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isMultiBranch}
                                                        onChange={(e) => setIsMultiBranch(e.target.checked)}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF5722' },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF5722' },
                                                        }}
                                                    />
                                                }
                                                label={<Box>
                                                    <Typography variant="body2" fontWeight="600">Enable Multi-branch Setup?</Typography>
                                                    <Typography variant="caption" color="text.secondary">Allows owner to manage multiple outlets</Typography>
                                                </Box>}
                                                sx={{ mr: 4 }}
                                            />

                                            {isMultiBranch && (
                                                <Fade in={isMultiBranch}>
                                                    <Box sx={{ width: 120 }}>
                                                        <InputField icon={Store} placeholder="Count" type="number" />
                                                    </Box>
                                                </Fade>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'white', borderTop: '1px solid #EDEDED' }}>
                        <Button variant="outlined" sx={{ textTransform: 'none', color: '#546E7A', borderColor: '#CFD8DC', px: 3 }}>Reset Form</Button>
                        <Button variant="contained" sx={{ bgcolor: '#FF5722', '&:hover': { bgcolor: '#F4511E' }, textTransform: 'none', px: 4, fontWeight: 600, boxShadow: '0 4px 14px rgba(255, 87, 34, 0.4)' }}>Create Client Account</Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default NewUser;
