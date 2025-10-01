'use client';

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  priority?: boolean; // Next.js Image 호환성을 위해
  fill?: boolean; // Next.js Image 호환성을 위해
  sizes?: string; // Next.js Image 호환성을 위해
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, fallback, className, containerClassName, onError, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(e);
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      props.onLoad?.(e);
    };

    if (hasError && fallback) {
      return <div className={containerClassName}>{fallback}</div>;
    }

    return (
      <div className={cn('relative', containerClassName)}>
        {isLoading && (
          <div className={cn('absolute inset-0 bg-muted animate-pulse rounded', className)} />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-200',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
      </div>
    );
  },
);

OptimizedImage.displayName = 'OptimizedImage';
