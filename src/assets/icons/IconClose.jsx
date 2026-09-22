import React from 'react'

const IconClose = ({className, stroke}) => {
  return (
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className || ''}>
<g opacity="0.6">
<path d="M1.66211 14.3364L14.3354 1.66309" stroke={stroke || '#2A292C'} strokeWidth="1.5" strokeLinecap="round"/>
<path d="M14.3359 14.3364L1.66265 1.66309" stroke={stroke || '#2A292C'} strokeWidth="1.5" strokeLinecap="round"/>
</g>
</svg>

  )
}

export default IconClose
