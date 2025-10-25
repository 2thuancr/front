'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '@/hooks/useAuth';

interface GoogleLoginButtonProps {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  className = '',
  disabled = false
}) => {
  const { googleLogin } = useAuth();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Google Identity Services
    const loadGoogleScript = () => {
      if (window.google) {
        setIsGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        onError?.({ error: 'Failed to load Google services' });
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  useEffect(() => {
    if (isGoogleLoaded && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
        onError?.(error);
      }
    }
  }, [isGoogleLoaded]);

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      onError?.({ error: 'No credential received from Google' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleLogin(response.credential);
      onSuccess?.(result);
    } catch (error) {
      console.error('Google login error:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!isGoogleLoaded || !window.google) {
      onError?.({ error: 'Google services not loaded' });
      return;
    }

    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: show popup manually
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
              locale: 'vi'
            }
          );
        }
      });
    } catch (error) {
      console.error('Error triggering Google login:', error);
      onError?.(error);
    }
  };

  if (!isGoogleLoaded) {
    return (
      <Button
        label="Đang tải Google..."
        className={`w-full ${className}`}
        disabled={true}
        icon="pi pi-spin pi-spinner"
      />
    );
  }

  return (
    <div className="w-full">
      <Button
        label="Đăng nhập với Google"
        className={`w-full ${className}`}
        onClick={handleGoogleLogin}
        disabled={disabled || isLoading}
        loading={isLoading}
        icon="pi pi-google"
        severity="secondary"
        outlined
      />
      <div id="google-signin-button" className="hidden"></div>
    </div>
  );
};

export default GoogleLoginButton;
