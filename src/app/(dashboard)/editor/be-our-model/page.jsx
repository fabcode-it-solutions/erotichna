import React from 'react'
import Index from '@/sections/(dashboard)/editor/be-our-model/view'
import RoleChecker from '../../RoleChecker'

export const metadata = {
  title: "Editor | Be Our Model | Erotichna",
  description: "Be Our Model page data editor",
};

const page = () => {
  return (
    <RoleChecker>
      <Index/>
    </RoleChecker>
  )
}

export default page