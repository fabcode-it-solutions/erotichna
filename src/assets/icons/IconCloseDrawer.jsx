import React from 'react'

const IconCloseDrawer = ({className, stroke}) => {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" className={className || ''}>
  <path d="M0.662109 13.4252L13.3354 0.751953" stroke={stroke || "#242424"} strokeWidth="1.5"/>
  <path d="M13.3359 13.4252L0.662646 0.751953" stroke={stroke || "#242424"} strokeWidth="1.5"/>
</svg>
  )
}

export default IconCloseDrawer
