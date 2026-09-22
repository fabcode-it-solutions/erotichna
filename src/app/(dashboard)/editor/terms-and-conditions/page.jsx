import React from 'react'
import Index from '@/sections/(dashboard)/editor/terms-and-conditions/view'
import RoleChecker from '../../RoleChecker'


export const metadata = {
  title: "Editor | Terms & Conditions | Erotichna",
  description: "Terms & Conditions page data editor",
};

const page = () => {
  return (
    <RoleChecker>
        <Index/>
    </RoleChecker>
  )
}

export default page