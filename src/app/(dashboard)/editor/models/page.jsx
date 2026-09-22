import React from 'react'
import Index from '@/sections/(dashboard)/editor/models/view'
import RoleChecker from '../../RoleChecker'

export const metadata = {
  title: "Editor | Models | Erotichna",
  description: "Models page data editor",
};

const page = () => {
  return (
    <RoleChecker>
        <Index/>
    </RoleChecker>
  )
}

export default page