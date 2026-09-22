import RoleChecker from '@/app/(dashboard)/RoleChecker'
import Index from '@/sections/(dashboard)/comments/edit'
import React from 'react'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const page = async  ({ params }) => {
  const slug = (await params).slug
  return (
<RoleChecker>
    <Index slug={slug}/>
</RoleChecker>
  )
}

export default page
