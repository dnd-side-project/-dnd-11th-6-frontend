import { Controller, FieldValues } from 'react-hook-form'
import Image from 'next/image'
import Check from 'public/icons/check.svg'
import Meatballs from 'public/icons/meatballs.svg'
import { BaseInputProps } from '../types'

export interface TextInputProps<T extends FieldValues>
  extends BaseInputProps<T> {
  success?: boolean
  checking?: boolean
  successMessage?: string
  checkingMessage?: string
  maxLength?: number
  showCharCount?: boolean
}

export function TextInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error = null,
  success,
  checking,
  className = '',
  successMessage = '알맞은 링크를 찾았어요!',
  checkingMessage = '확인중',
  description,
  maxLength,
  showCharCount,
}: TextInputProps<T>) {
  const inputClassName = `w-full py-4 px-[18px] border rounded-[14px] text-[18px] focus:outline-none focus:ring-0 ${className} ${
    error ? 'border-red-500' : 'border-gray-600'
  }`

  const renderInput = (field: any) => {
    const props = {
      ...field,
      id: name,
      type: 'text',
      placeholder,
      className: inputClassName,
      maxLength,
    }

    const charCount = field.value?.length || 0

    return (
      <div className="mb-6">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor={name} className="block text-gray-600 text-sm">
              {label}
            </label>
          </div>
          <div className="relative">
            <input {...props} />
            {description && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className={`${error ? 'flex justify-between' : 'w-full'}`}>
          {error && (
            <p className="text-red-600 text-sm">
              {typeof error === 'string' ? error : error.message}
            </p>
          )}
          {success && (
            <div className="flex">
              <Image src={Check} alt="Check" className="mt-1" />
              <p className="text-green-600 text-sm ml-1">{successMessage}</p>
            </div>
          )}
          {checking && (
            <div className="flex">
              <Image src={Meatballs} alt="Meatballs" className="mt-1" />
              <p className="text-gray-700 text-sm mt-1 ml-1">
                {checkingMessage}
              </p>
            </div>
          )}
          {showCharCount && maxLength && (
            <span className="text-sm text-gray-600 flex justify-end">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }

  return control ? (
    <Controller
      name={name}
      control={control}
      render={({ field }) => renderInput(field)}
    />
  ) : (
    renderInput({ name })
  )
}
