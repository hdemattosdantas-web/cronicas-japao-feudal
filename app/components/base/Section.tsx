'use client'

import React from 'react'
import { useTheme, getThemeClass } from '@/lib/theme'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'default' | 'paper' | 'coal'
  container?: boolean
  title?: string
  subtitle?: string
}

export default function Section({
  children,
  className,
  background = 'default',
  container = true,
  title,
  subtitle,
}: SectionProps) {
  const theme = useTheme()

  const backgroundClasses = {
    default: '',
    paper: theme.classes.bg.paper,
    coal: theme.classes.bg.coal,
  }

  const sectionClasses = getThemeClass(
    'py-12',
    backgroundClasses[background],
    className
  )

  const contentClasses = container
    ? getThemeClass('container', theme.classes.animation.fadeIn)
    : theme.classes.animation.fadeIn

  return (
    <section className={sectionClasses}>
      <div className={contentClasses}>
        {title && (
          <div className="mb-8 text-center">
            <h2 className={theme.classes.title.section}>
              {title}
            </h2>
            {subtitle && (
              <p className={getThemeClass(theme.classes.narrative.lead, 'mt-4 max-w-3xl mx-auto')}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}