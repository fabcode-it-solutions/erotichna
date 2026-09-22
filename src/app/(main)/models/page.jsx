import React from 'react'
import MainWrapper from '../MainWrapper'
import Index from '@/sections/(main)/models/view'


export const metadata = {
  title: "Models | Erotichna",
  description: "",
};
function page() {
  return (
    <MainWrapper>
        <Index/>
    </MainWrapper>
  )
}

export default page