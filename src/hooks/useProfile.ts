import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/index';
import { fetchUserProfile, updateUserProfile, clearError } from '@/store/userSlice';
import { UpdateProfileData } from '@/types/user';
import { useCallback } from 'react';

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  console.log('useProfile hook render:', { profile, isLoading, error });

  const fetchProfile = useCallback(async () => {
    try {
      console.log('🚀 Fetching profile...');
      const token = localStorage.getItem('token');
      console.log('🔑 Token:', token ? 'exists' : 'not found');
      
      const response = await dispatch(fetchUserProfile()).unwrap();
      console.log('✅ Profile response:', response);
      return response;
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      throw error;
    }
  }, [dispatch]);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const clearProfileError = () => {
    dispatch(clearError());
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    clearProfileError,
  };
};


