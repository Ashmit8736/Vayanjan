import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Grid,
    Link,
    Divider,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Google,
    RestaurantMenu,
} from '@mui/icons-material';
import { login, clearError } from '@store/slices/authSlice';
import loginImage from '../../assets/images/login.webp'; // Import the image

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    const { isOnline } = useSelector((state) => state.offline);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (window.electronAPI) {
                window.electronAPI.loginSuccess();
            }

            if (user.role === 'USER' || user.role === 'owner') {
                navigate('/user-admin');
            } else if (user.role === 'manager' || user.role === 'both') {
                navigate('/manager');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return;
        dispatch(login(formData));
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const brandColor = '#FF5722'; // Orange color from design
    const bgColor = '#FFFBF7';    // Cream background

    const passwordRef = React.useRef(null);

    const handleEmailKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordRef.current?.focus();
        }
    };

    return (
        <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
            {/* Left Side - Form */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    bgcolor: bgColor,
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 4, md: 5 }, // Reduced padding
                    position: 'relative',
                    justifyContent: 'center', // Center vertically
                }}
            >
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Box
                        sx={{
                            bgcolor: brandColor,
                            borderRadius: 1,
                            p: 0.5,
                            mr: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <RestaurantMenu sx={{ color: 'white', fontSize: 18 }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color={brandColor} fontSize="1.1rem">
                        Vyanjan
                    </Typography>
                </Box>

                <Box sx={{ maxWidth: 380, width: '100%', mx: 'auto' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5, color: '#1a1a1a' }}>
                        Welcome back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.85rem' }}>
                        Enter your credentials to access your inventory.
                    </Typography>

                    {!isOnline && (
                        <Alert severity="warning" sx={{ mb: 2, py: 0 }}>You are offline</Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, py: 0 }}>{error}</Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block', color: '#4a4a4a' }}>
                                Email address
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="name@restaurant.com"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyDown={handleEmailKeyDown}
                                disabled={loading || !isOnline}
                                variant="outlined"
                                size="small" // Small input
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        fontSize: '0.9rem',
                                        '& fieldset': { borderColor: '#e0e0e0' },
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" fontWeight="600" sx={{ mb: 0.5, display: 'block', color: '#4a4a4a' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="........"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                inputRef={passwordRef}
                                disabled={loading || !isOnline}
                                variant="outlined"
                                size="small" // Small input
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        fontSize: '0.9rem',
                                        '& fieldset': { borderColor: '#e0e0e0' },
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end" size="small">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Link href="#" underline="hover" sx={{ color: '#9e9e9e', fontSize: '0.75rem' }}>
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading || !isOnline}
                            sx={{
                                bgcolor: brandColor,
                                color: 'white',
                                py: 1, // Reduced button height
                                textTransform: 'none',
                                fontWeight: 600,
                                mb: 3,
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: '#E64A19',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
                        </Button>

                        <Divider sx={{ mb: 3, fontSize: '0.7rem', color: '#9e9e9e' }}>OR CONTINUE WITH</Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google fontSize="small" />}
                            sx={{
                                color: '#1a1a1a',
                                borderColor: '#e0e0e0',
                                py: 1, // Reduced button height
                                textTransform: 'none',
                                fontWeight: 600,
                                bgcolor: 'white',
                                fontSize: '0.9rem',
                                '&:hover': {
                                    bgcolor: '#f5f5f5',
                                    borderColor: '#d0d0d0',
                                },
                            }}
                        >
                            Google
                        </Button>
                    </form>

                    <Typography variant="body2" align="center" sx={{ mt: 3, color: '#9e9e9e', fontSize: '0.75rem' }}>
                        Don't have an account?{' '}
                        <Link href="#" underline="hover" sx={{ color: brandColor, fontWeight: 600 }}>
                            Request a demo
                        </Link>
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side - Image */}
            <Grid
                item
                md={6}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    backgroundImage: `url(${loginImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 5,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        color: 'white',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Manage your kitchen with style.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: '90%', fontSize: '0.85rem' }}>
                        Streamline your billing, track inventory in real-time, and boost your restaurant's efficiency with our all-in-one platform.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
