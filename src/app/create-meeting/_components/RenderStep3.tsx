import React from 'react'
import FormInput from '@/components/Form/Input/FormInput'
import { StepProps } from '@/types/meetingStep'

function RenderStep3({ form, onSubmit }: StepProps) {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-4">비밀번호 설정</h2>
      <FormInput
        name="password"
        control={control}
        label="비밀번호를 설정해주세요."
        type="password"
        placeholder="******"
        error={errors.password?.message}
      />
      <button
        type="submit"
        className={`w-full p-3 rounded-md ${
          isValid
            ? 'bg-black text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isValid}
      >
        등록하기
      </button>
    </form>
  )
}

export default RenderStep3
