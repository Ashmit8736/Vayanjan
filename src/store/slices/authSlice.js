import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI } from '@services/api/authAPI';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials);
            // Store token in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Login failed' });
        }
    }
);

// Initial state - check localStorage for persistence
const token = localStorage.getItem('authToken');
let user = null;
try {
    const keptUser = localStorage.getItem('user');
    if (keptUser && keptUser !== 'undefined') {
        user = JSON.parse(keptUser);
    }
} catch (e) {
    console.warn('Failed to parse user from localStorage:', e);
    localStorage.removeItem('user');
}

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!token, // True if token exists
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload?.message || 'Login failed';
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
