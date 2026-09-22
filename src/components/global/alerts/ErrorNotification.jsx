import React from 'react'

const ErrorNotification = ({className, text}) => {
  return (
<span className={`p-3 text-red-300 text-sm leading-4 block bg-red-600 bg-opacity-50 mt-2 ${className || ''}`}>{text}</span>
  )
}

export default ErrorNotification
