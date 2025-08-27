import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/index';
import { fetchUserProfile, updateUserProfile, clearError } from '@/store/userSlice';
import { UpdateProfileData } from '@/types/user';

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  const fetchProfile = async () => {
    try {
      await dispatch(fetchUserProfile()).unwrap();
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

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


