export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  role: 'user' | 'admin';
  isEmailVerified: boolean;
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

