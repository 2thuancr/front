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

  const fetchProfile = useCallback(async () => {
    try {
      const response = await dispatch(fetchUserProfile()).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      return true;
    } catch (error) {
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


