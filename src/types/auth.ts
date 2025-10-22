import { UserProfile } from './user';

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  MANAGER = 'manager'
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager'
}

export enum VendorStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected'
}

export interface User extends UserProfile {
  role: UserRole;
  isActive: boolean;
}

export interface Admin {
  adminId: number;
  fullName: string;
  email: string;
  username: string;
  role: AdminRole;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface Vendor {
  vendorId: number;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  ward: string;
  businessLicense?: string;
  taxCode: string;
  username?: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: VendorStatus;
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: number;
  rejectedBy?: number;
  isActive: boolean;
}

export interface Staff extends UserProfile {
  role: UserRole.STAFF | UserRole.MANAGER;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface VendorLoginCredentials {
  username: string;
  password: string;
}

export interface StaffLoginCredentials {
  email: string;
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

export interface AdminAuthResponse {
  admin: Admin;
  access_token: string;
  refresh_token: string;
}

export interface VendorAuthResponse {
  vendor: Vendor;
  access_token: string;
  refresh_token: string;
}

export interface StaffAuthResponse {
  staff: Staff;
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | Admin | Vendor | Staff | null;
  userType: 'customer' | 'admin' | 'vendor' | 'staff' | null;
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

// Role checking utility functions
export const hasRole = (user: User | Admin | Vendor | Staff | null, role: UserRole | AdminRole): boolean => {
  if (!user) return false;
  return 'role' in user && user.role === role;
};

export const hasAnyRole = (user: User | Admin | Vendor | Staff | null, roles: (UserRole | AdminRole)[]): boolean => {
  if (!user) return false;
  return 'role' in user && roles.includes(user.role);
};

export const isAdmin = (user: User | Admin | Vendor | Staff | null): user is Admin => {
  return user !== null && 'adminId' in user;
};

export const isVendor = (user: User | Admin | Vendor | Staff | null): user is Vendor => {
  return user !== null && 'vendorId' in user;
};

export const isStaff = (user: User | Admin | Vendor | Staff | null): user is Staff => {
  return user !== null && 'role' in user && (user.role === UserRole.STAFF || user.role === UserRole.MANAGER);
};

export const isCustomer = (user: User | Admin | Vendor | Staff | null): user is User => {
  return user !== null && 'role' in user && user.role === UserRole.CUSTOMER;
};

export const getUserType = (user: User | Admin | Vendor | Staff | null): 'customer' | 'admin' | 'vendor' | 'staff' | null => {
  if (!user) return null;
  if (isAdmin(user)) return 'admin';
  if (isVendor(user)) return 'vendor';
  if (isStaff(user)) return 'staff';
  if (isCustomer(user)) return 'customer';
  return null;
};

