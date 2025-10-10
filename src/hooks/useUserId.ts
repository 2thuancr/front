import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserProfile } from '@/store/userSlice';

/**
 * Custom hook to get userId with fallback to localStorage and auto-fetch profile
 * Priority: Redux > localStorage
 */
export const useUserId = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userIdFromRedux = useSelector((state: RootState) => state.user?.profile?.id);
  const userProfileLoading = useSelector((state: RootState) => state.user?.isLoading);
  const [userId, setUserId] = useState<number | null>(null);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);

  useEffect(() => {
    // Priority: Redux > localStorage
    if (userIdFromRedux) {
      setUserId(userIdFromRedux);
      console.log("👤 User ID from Redux:", userIdFromRedux);
    } else {
      // Fallback to localStorage
      const localStorageUserId = localStorage.getItem('userId');
      if (localStorageUserId) {
        try {
          const parsedUserId = JSON.parse(localStorageUserId);
          setUserId(parsedUserId);
          console.log("👤 User ID from localStorage:", parsedUserId);
          
          // If we have userId from localStorage but no Redux data, try to fetch profile
          if (!hasTriedFetch && !userProfileLoading) {
            console.log("🔄 Attempting to fetch user profile...");
            setHasTriedFetch(true);
            dispatch(fetchUserProfile()).catch((error) => {
              console.error("❌ Failed to fetch user profile:", error);
            });
          }
        } catch (error) {
          console.error("❌ Error parsing userId from localStorage:", error);
          setUserId(null);
        }
      } else {
        setUserId(null);
        console.log("👤 No user ID found");
      }
    }
  }, [userIdFromRedux, dispatch, hasTriedFetch, userProfileLoading]);

  return userId;
};
