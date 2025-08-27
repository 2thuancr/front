import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/index';
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
} from '@/store/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push('/profile');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerUser(credentials)).unwrap();
      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push('/profile');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
};

