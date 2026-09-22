import React from 'react'

const Loader = ({message}) => {
  return (
    <div className='fixed w-full h-full top-0 left-0 z-[99999999] bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center'>
         <span className='text-white text-xl font-satoshi text-center'>   {message}</span>
    </div>
  )
}

export default Loader
