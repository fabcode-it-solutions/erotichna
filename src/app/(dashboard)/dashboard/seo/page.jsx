import React from 'react'
import Index from '@/sections/(dashboard)/seo/view'
import RoleChecker from '../../RoleChecker'

const page = () => {
  return (
  <RoleChecker>
    <Index/>
  </RoleChecker>
  )
}

export default page
