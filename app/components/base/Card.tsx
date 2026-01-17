'use client'

import React from 'react'
import { useTheme, getThemeClass } from '@/lib/theme'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'parchment' | 'scroll'
  className?: string
  title?: string
  subtitle?: string
}

export default function Card({
  children,
  variant = 'default',
  className,
  title,
  subtitle,
}: CardProps) {
  const theme = useTheme()

  const variantClasses = {
    default: theme.classes.card,
    parchment: theme.classes.parchment,
    scroll: theme.classes.scroll,
  }

  const classes = getThemeClass(
    variantClasses[variant],
    className
  )

  return (
    <div className={classes}>
      {title && (
        <div className="mb-6">
          <h3 className={getThemeClass(theme.classes.title.card, theme.classes.text.center)}>
            {title}
          </h3>
          {subtitle && (
            <p className={getThemeClass(theme.classes.narrative.body, theme.classes.text.center, 'text-muted mt-2')}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}