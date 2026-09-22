import IconImage from '@/assets/icons/IconImage'
import React from 'react'

const ModelSkeleton = () => {
  return (
    <div className="w-full relative ">
    <div className="pb-[170.97%] relative w-full bg-dark-150 animate-pulse rounded-lg">
      <IconImage className="fill-gray-600 w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
    <div className="text-xl leading-none  mb-2xl:text-base mt-[5px] font-normal  rounded-lg min-h-[25px] bg-dark-150 animate-pulse"></div>
  </div>
  )
}

export default ModelSkeleton
