import React from 'react'
import Image from 'next/image'

const MeetingActionButtons = () => (
  <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 gap-2 shadow-top animate-float">
    <button className="bg-blue-500 text-white px-5 py-3 gap-1 rounded-full flex items-center">
      <Image src="/icons/camera.svg" alt="Camera" width={20} height={20} />
      <span>스냅찍기</span>
    </button>
    <button className="bg-gray-200 text-gray-800 px-5 py-3 gap-1 rounded-full flex items-center">
      <Image src="/icons/download.svg" alt="Download" width={20} height={20} />
      <span>다운로드</span>
    </button>
  </div>
)

export default MeetingActionButtons
