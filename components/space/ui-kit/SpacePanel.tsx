'use client'

import { HTMLAttributes, ReactNode } from 'react'
import '@/components/space/ui-kit/ui-kit.css'

interface SpacePanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
  titleAr?: string
  header?: ReactNode
  footer?: ReactNode
  variant?: 'default' | 'glass' | 'solid'
}

export default function SpacePanel({
  children,
  title,
  titleAr,
  header,
  footer,
  variant = 'default',
  className = '',
  ...props
}: SpacePanelProps) {
  const baseClasses = 'space-panel'
  const variantClasses = {
    default: 'space-panel-default',
    glass: 'space-panel-glass',
    solid: 'space-panel-solid',
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {(title || titleAr || header) && (
        <div className="space-panel-header">
          {header || (
            <>
              {title && <h3 className="space-panel-title">{title}</h3>}
              {titleAr && <h4 className="space-panel-title-ar">{titleAr}</h4>}
            </>
          )}
        </div>
      )}
      <div className="space-panel-body">{children}</div>
      {footer && <div className="space-panel-footer">{footer}</div>}
    </div>
  )
}
