import React from 'react'
import Index from '@/sections/(dashboard)/editor/header/view'
import RoleChecker from '../../RoleChecker'

export const metadata = {
  title: "Editor | Header | Erotichna",
  description: "Header data editor",
};


const page = () => {
  return (
    <RoleChecker>
        <Index />
    </RoleChecker>
  )
}

export default page
