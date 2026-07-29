import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'icon',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  }[size];

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className || `${sizeClasses} shrink-0`}
      >
        <text
          x="50%"
          y="56%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="56"
          letterSpacing="-0.04em"
        >
          JV
        </text>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 500 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto shrink-0"
      >
        <g fill="currentColor">
          {/* JV Icon Text */}
          <text
            x="0"
            y="110"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="120"
            letterSpacing="-0.04em"
            fill="currentColor"
          >
            JV
          </text>

          {/* DESIGN Subtitle */}
          <text
            x="0"
            y="196"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="54"
            letterSpacing="0.46em"
            fill="currentColor"
          >
            DESIGN
          </text>
        </g>
      </svg>
    </div>
  );
};
