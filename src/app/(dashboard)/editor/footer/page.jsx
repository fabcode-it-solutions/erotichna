import React from 'react'
import Index from '@/sections/(dashboard)/editor/footer/view'
import RoleChecker from '../../RoleChecker'


export const metadata = {
  title: "Editor | Footer | Erotichna",
  description: "Footer data editor",
};

const page = () => {
  return (
    <RoleChecker>
      <Index />
    </RoleChecker>
  )
}

export default page