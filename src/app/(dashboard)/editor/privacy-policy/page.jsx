import React from 'react'
import Index from '@/sections/(dashboard)/editor/privacy-policy/view'
import RoleChecker from '../../RoleChecker'

export const metadata = {
  title: "Editor | Privacy Policy | Erotichna",
  description: "Privacy policy page data editor",
};

const page = () => {
  return (
    <RoleChecker>
        <Index/>
    </RoleChecker>
  )
}

export default page