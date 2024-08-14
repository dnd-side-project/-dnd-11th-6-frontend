import React from 'react'
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  FieldError,
} from 'react-hook-form'

export interface InputProps<T extends FieldValues> {
  name: Path<T>
  control?: Control<T>
  rules?: RegisterOptions
  label?: string
  type?: string
  placeholder?: string
  error?: string | FieldError
  success?: boolean
  checking?: boolean
  className?: string
  as?: 'input' | 'textarea' | 'checkbox'
  errorMessage?: string
  successMessage?: string
  checkingMessage?: string
  description?: string
}

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  error,
  success,
  checking,
  className = '',
  as = 'input',
  successMessage = '알맞은 링크를 찾았어요!',
  checkingMessage = '확인중',
  description,
}: InputProps<T>) {
  const inputClassName = `w-full py-4 px-[18px] border rounded-[14px] text-[18px] focus:outline-none focus:ring-0 ${className} ${error ? 'border-red-500' : 'border-gray-300'}`

  const renderInput = (field: any) => {
    const props = {
      ...field,
      id: name,
      type,
      placeholder,
      className: as === 'checkbox' ? 'mr-2' : inputClassName,
    }

    if (as === 'textarea') return <textarea rows={3} {...props} />
    if (as === 'checkbox') {
      return (
        <label htmlFor={name} className="flex items-center">
          <input {...props} />
          <span>{label}</span>
        </label>
      )
    }
    return (
      <div className="relative">
        <input {...props} />
        {description && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            {description}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="mb-4">
      {as !== 'checkbox' && (
        <label htmlFor={name} className="block mb-2 text-gray-600 text-sm">
          {label}
        </label>
      )}
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => renderInput(field)}
        />
      ) : (
        renderInput({ name })
      )}
      {error && (
        <p className="text-red-600 text-sm mt-1">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm mt-1">{successMessage}</p>
      )}
      {checking && (
        <p className="text-gray-500 text-sm mt-1">{checkingMessage}</p>
      )}
    </div>
  )
}
