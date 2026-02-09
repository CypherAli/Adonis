/**
 * Accessible Form Components
 * Based on UX Guidelines #43 - Form labels and accessibility
 */

import React, { forwardRef } from 'react'

interface FormFieldProps {
  label: string
  id: string
  error?: string
  required?: boolean
  helper?: string
  children: React.ReactNode
}

export function FormField({
  label,
  id,
  error,
  required,
  helper,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      {children}
      {helper && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, required, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const inputClass = `
      w-full px-3 py-2 border rounded-md
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
      ${className}
    `.trim()

    if (label) {
      return (
        <FormField label={label} id={inputId} error={error} required={required} helper={helperText}>
          <input
            ref={ref}
            id={inputId}
            className={inputClass}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </FormField>
      )
    }

    return (
      <input
        ref={ref}
        id={inputId}
        className={inputClass}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, required, className = '', ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    const textareaClass = `
      w-full px-3 py-2 border rounded-md resize-y
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
      ${className}
    `.trim()

    if (label) {
      return (
        <FormField label={label} id={textareaId} error={error} required={required} helper={helperText}>
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClass}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </FormField>
      )
    }

    return (
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClass}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, id, required, options, className = '', ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

    const selectClass = `
      w-full px-3 py-2 border rounded-md
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
      ${className}
    `.trim()

    const selectElement = (
      <select
        ref={ref}
        id={selectId}
        className={selectClass}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )

    if (label) {
      return (
        <FormField label={label} id={selectId} error={error} required={required} helper={helperText}>
          {selectElement}
        </FormField>
      )
    }

    return selectElement
  }
)

Select.displayName = 'Select'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, id, className = '', ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              w-4 h-4 border border-gray-300 rounded
              focus:ring-2 focus:ring-primary
              text-primary cursor-pointer
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        <div className="ml-3">
          <label htmlFor={checkboxId} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            {label}
          </label>
          {helperText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
