import React from 'react'
import Index from '@/sections/(dashboard)/editor/homepage/view'
import RoleChecker from '@/app/(dashboard)/RoleChecker';



export const metadata = {
  title: "Editor | Home | Erotichna",
  description: "Homepage data editor",
};


const page = () => {
  return (
    <RoleChecker>
          <Index />
    </RoleChecker>
  )
}

export default page
