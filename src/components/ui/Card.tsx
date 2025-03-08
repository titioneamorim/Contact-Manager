'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const getPaddingClasses = (padding: CardProps['padding'] = 'md'): string => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return paddings[padding]
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'bg-white rounded-lg shadow-sm',
          getPaddingClasses(padding),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('space-y-1.5', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={twMerge(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={twMerge('text-sm text-gray-500', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
CardDescription.displayName = 'CardDescription'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge('pt-0', className)} {...props}>
        {children}
      </div>
    )
  }
)
CardContent.displayName = 'CardContent'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge('flex items-center pt-4', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
