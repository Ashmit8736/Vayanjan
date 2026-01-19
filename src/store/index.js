import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import offlineReducer from './slices/offlineSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        offline: offlineReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
