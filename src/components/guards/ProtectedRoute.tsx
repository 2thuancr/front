'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, user, hasRole, hasAnyRole } = useAuth();
  const router = useRouter();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    router.push(redirectTo);
    return null;
  }
  
  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    router.push('/access-denied');
    return null;
  }
  
  // Check if user has any of the allowed roles
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    router.push('/access-denied');
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;

