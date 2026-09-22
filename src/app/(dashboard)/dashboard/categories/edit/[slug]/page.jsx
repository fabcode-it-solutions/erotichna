import React from 'react'
import Index from '@/sections/(dashboard)/categories/edit'
import RoleChecker from '@/app/(dashboard)/RoleChecker'

const page = async  ({ params }) => {
  const slug = (await params).slug
    
  return (
    <RoleChecker>
        <Index slug={slug} />
    </RoleChecker>
  )
}

export default page
