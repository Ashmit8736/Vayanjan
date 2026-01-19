import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOnline: navigator.onLine,
    pendingRequests: [],
    syncInProgress: false,
};

const offlineSlice = createSlice({
    name: 'offline',
    initialState,
    reducers: {
        setOnlineStatus: (state, action) => {
            state.isOnline = action.payload;
        },
        addPendingRequest: (state, action) => {
            state.pendingRequests.push(action.payload);
        },
        removePendingRequest: (state, action) => {
            state.pendingRequests = state.pendingRequests.filter(
                (req) => req.id !== action.payload
            );
        },
        clearPendingRequests: (state) => {
            state.pendingRequests = [];
        },
        setSyncInProgress: (state, action) => {
            state.syncInProgress = action.payload;
        },
    },
});

export const {
    setOnlineStatus,
    addPendingRequest,
    removePendingRequest,
    clearPendingRequests,
    setSyncInProgress,
} = offlineSlice.actions;

export default offlineSlice.reducer;
