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

