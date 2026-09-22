import React from 'react'
import MainWrapper from '../MainWrapper'
import Index from '@/sections/(main)/admin/view'

export const metadata = {
  title: "Admin | Erotichna",
  description: "",
};

const page = () => {
  return (
   <MainWrapper className=''>
        <Index />
   </MainWrapper>
  )
}

export default page
