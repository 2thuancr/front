'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useUserId } from '@/hooks/useUserId';

export const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, userType } = useAuth();
  const userId = useUserId();
  
  // Redux state
  const authState = useSelector((state: RootState) => state.auth);
  const userState = useSelector((state: RootState) => state.user);
  
  // LocalStorage data
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const localUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const localUserType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm text-xs">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      
      <div className="space-y-1">
        <div>
          <strong>useAuth:</strong>
          <div className="ml-2">
            <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
            <div>User: {user ? (user as any).firstName ? `${(user as any).firstName} ${(user as any).lastName}` : (user as any).name || 'Unknown' : 'None'}</div>
            <div>Type: {userType || 'None'}</div>
          </div>
        </div>
        
        <div>
          <strong>useUserId:</strong>
          <div className="ml-2">ID: {userId || 'None'}</div>
        </div>
        
        <div>
          <strong>Redux Auth:</strong>
          <div className="ml-2">
            <div>Authenticated: {authState.isAuthenticated ? '✅' : '❌'}</div>
            <div>Loading: {authState.isLoading ? '⏳' : '✅'}</div>
            <div>Token: {authState.token ? '✅' : '❌'}</div>
          </div>
        </div>
        
        <div>
          <strong>Redux User:</strong>
          <div className="ml-2">
            <div>Profile: {userState.profile ? '✅' : '❌'}</div>
            <div>Loading: {userState.isLoading ? '⏳' : '✅'}</div>
          </div>
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <div className="ml-2">
            <div>Token: {token ? '✅' : '❌'}</div>
            <div>User: {localUser ? '✅' : '❌'}</div>
            <div>Type: {localUserType || 'None'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
