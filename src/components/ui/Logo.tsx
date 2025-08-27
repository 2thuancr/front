import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* HCMUTE Logo Image */}
        <div className="w-full h-full relative">
          <Image
            src="/images/hcmute-logo.png"
            alt="HCMUTE Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Gift Shop Badge */}
        <div className="absolute -top-1 -right-1 w-1/3 h-1/3 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-2/3 h-2/3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.666.105 5.5 5.5 0 0 0-.114 7.984L10 18.78l8.39-8.4a5.5 5.5 0 0 0-.114-7.984 5.5 5.5 0 0 0-7.666-.105L10 3.22z"/>
          </svg>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold text-blue-800`}>
            HCMUTE
          </span>
          <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent`}>
            Gift Shop
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
