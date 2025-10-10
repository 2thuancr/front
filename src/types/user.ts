export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  address?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  isVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UploadAvatarData {
  avatar: File;
}

// Customer interface based on API response
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  gender: 'male' | 'female' | 'other' | null;
  dateOfBirth: string | null;
  password: string;
  isVerified: boolean;
  otpCode: string | null;
  otpExpiry: string | null;
  refreshToken: string | null;
  avatar: string | null;
  role: 'customer';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersResponse {
  message: string;
  customers: Customer[];
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
}

