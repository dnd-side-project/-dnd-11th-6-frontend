'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { reenterMeeting } from '@/apis/apiUtils'
import { TextInput } from '@/components/Inputs/TextInput/index'
import useDebounce from '@/hooks/useDebounce'
import { usePasswordPopupStore } from '@/stores/usePasswordPopupStore'
import useUserStore from '@/stores/useUserStore'
import { ApiError } from '@/types/api'
import { ValidatePasswordResponse } from '@/types/meeting'
import Popup from '../components/Popup/index'
import { validatePassword } from './meetingApi'

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, '암호를 입력해주세요.')
    .min(4, '암호는 최소 4자 이상이어야 해요. :(')
    .max(20, '비밀번호는 최대 20자까지 입력 가능해요. :('),
})

type PasswordFormData = z.infer<typeof passwordSchema>

function PasswordPopup() {
  const { isOpen, meetingId, onConfirm, closePopup, shouldRedirectOnClose } =
    usePasswordPopupStore()
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isReentering, setIsReentering] = useState(false)
  const [lastCheckedPassword, setLastCheckedPassword] = useState('')
  const router = useRouter()

  const { nickname } = useUserStore((state) => ({
    nickname: state.nickname,
  }))

  const {
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onChange',
  })

  const passwordValue = watch('password')
  const debouncedPassword = useDebounce(passwordValue, 500)

  const validatePasswordMutation = useMutation<
    ValidatePasswordResponse,
    ApiError,
    { meetingId: number; password: string }
  >({
    mutationFn: ({ meetingId: id, password }) => validatePassword(id, password),
    onSuccess: () => {
      setIsPasswordValid(true)
      setLastCheckedPassword(debouncedPassword)
    },
    onError: () => {
      setIsPasswordValid(false)
      setLastCheckedPassword(debouncedPassword)
    },
  })

  useEffect(() => {
    if (
      debouncedPassword &&
      debouncedPassword.length >= 4 &&
      meetingId &&
      debouncedPassword !== lastCheckedPassword
    ) {
      validatePasswordMutation.mutate({
        meetingId,
        password: debouncedPassword,
      })
    } else if (debouncedPassword !== lastCheckedPassword) {
      setIsPasswordValid(false)
    }
  }, [debouncedPassword, meetingId, lastCheckedPassword])

  useEffect(() => {
    if (!isOpen) {
      reset()
      setIsPasswordValid(false)
      setLastCheckedPassword('')
    }
  }, [isOpen, reset])

  useEffect(
    () => () => {
      closePopup()
    },
    [closePopup],
  )

  const handleConfirm = useCallback(async () => {
    if (isPasswordValid && meetingId) {
      setIsReentering(true)
      try {
        const success = await reenterMeeting(meetingId, passwordValue)
        if (success) {
          if (onConfirm) {
            await onConfirm(passwordValue)
          }
          await new Promise((resolve) => {
            window.setTimeout(resolve, 500)
          })
          closePopup()
          router.push('/meeting-home')
        } else {
          throw new Error('재입장 실패')
        }
      } catch (error) {
        console.error('Error during re-entry:', error)
        alert('모임 재입장에 실패했습니다. 다시 시도해주세요.')
      } finally {
        setIsReentering(false)
      }
    }
  }, [isPasswordValid, meetingId, passwordValue, onConfirm, closePopup, router])

  const errorMessage =
    errors.password?.message ||
    (validatePasswordMutation.isError &&
    debouncedPassword === lastCheckedPassword
      ? '틀린 암호입니다.'
      : null)

  return (
    <Popup
      isOpen={isOpen}
      cancelText=""
      confirmText={isReentering ? '재입장 중...' : '입장하기'}
      onClose={() => {
        closePopup()
        if (shouldRedirectOnClose) {
          router.push('/')
        }
      }}
      onConfirm={handleConfirm}
      title={
        <>
          {nickname || ''}님<br />
          다시 오셨네요!
        </>
      }
      hasCloseButton
      confirmDisabled={!isPasswordValid || isReentering}
    >
      <p className="text-center text-body1 text-gray-500 mb-4">
        진입을 위해서
        <br />
        모임 암호를 입력해주세요.
      </p>
      <TextInput
        name="password"
        control={control}
        type="password"
        placeholder="암호를 입력해주세요"
        success={isPasswordValid && debouncedPassword === lastCheckedPassword}
        successMessage="비밀번호 입력 완료!"
        error={errorMessage}
        checking={validatePasswordMutation.isPending}
      />
    </Popup>
  )
}

export default PasswordPopup
