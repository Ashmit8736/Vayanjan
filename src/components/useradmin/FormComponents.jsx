import React from 'react';
import { Box, Typography, InputBase } from '@mui/material';

export const InputField = ({ icon: Icon, placeholder, disabled, type = "text", value, onChange }) => (
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
            borderColor: '#009688',
            boxShadow: '0 4px 12px rgba(0, 150, 136, 0.05)'
        }
    }}>
        {Icon && <Icon sx={{ color: 'text.secondary', mr: 1.5, fontSize: '1.2rem' }} />}
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

export const SectionHeader = ({ title }) => (
    <Typography
        variant="subtitle2"
        fontWeight="800"
        color="text.secondary"
        sx={{ mb: 2, letterSpacing: '0.5px', fontSize: '0.75rem', textTransform: 'uppercase' }}
    >
        {title}
    </Typography>
);
