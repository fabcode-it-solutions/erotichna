import RoleChecker from '@/app/(dashboard)/RoleChecker';
import Index from '@/sections/(dashboard)/edit-video/view';
import React from 'react';

const page = async ({params}) => {
  const slug = (await params).slug
  return (
    <RoleChecker>
       <Index slug={slug}/>
    </RoleChecker>
  )
}

export default page
