import React from 'react'
import Index from '@/sections/(dashboard)/create-post/view'
import RoleChecker from '@/app/(dashboard)/RoleChecker'

const page = () => {
  return (
 <RoleChecker>
    <Index />
 </RoleChecker>
  )
}

export default page
