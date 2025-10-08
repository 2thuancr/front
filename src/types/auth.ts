import { UserProfile } from './user';

export enum UserRole {
  USER = 'user'
}

export interface User extends UserProfile {
  role: UserRole;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

