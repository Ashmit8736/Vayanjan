import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnlineStatus } from '@store/slices/offlineSlice';

/**
 * Custom hook to monitor online/offline status
 * @returns {boolean} - Current online status
 */
const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            dispatch(setOnlineStatus(true));
            console.log('✅ Back online');
        };

        const handleOffline = () => {
            setIsOnline(false);
            dispatch(setOnlineStatus(false));
            console.log('❌ Gone offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [dispatch]);

    return isOnline;
};

export default useOnlineStatus;
