'use client'

import React from 'react'
import { useTheme, getThemeClass } from '@/lib/theme'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const theme = useTheme()

  const baseClasses = 'font-interface font-semibold uppercase tracking-wider transition-all duration-300 relative overflow-hidden'

  const variantClasses = {
    primary: theme.classes.button.primary,
    secondary: theme.classes.button.secondary,
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg',
  }

  const classes = getThemeClass(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}