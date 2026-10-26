import * as React from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  /** id of the control, so the label is associated with it. */
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-foreground block text-sm font-medium"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p
          id={htmlFor ? `${htmlFor}-hint` : undefined}
          className="text-muted-foreground text-xs"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="text-destructive flex items-center gap-1 text-xs font-medium"
        >
          <svg
            className="h-3 w-3 shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 3.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5zM8 11a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 11z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
