import React from 'react'
import Index from '@/sections/(dashboard)/posts/view'
import RoleChecker from '../../RoleChecker'

const page = () => {
  return (
  <RoleChecker>
    <Index />
  </RoleChecker>
  )
}

export default page
