import React from 'react'

const SuccessNotification = ({className, text}) => {
  return (
<span className={`p-3 text-green-300 text-sm leading-4 block bg-green-600 bg-opacity-50 mt-2 ${className || ''}`}>{text}</span>
  )
}

export default SuccessNotification
