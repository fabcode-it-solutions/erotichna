"use client"
import useAdmin from '@/contexts/admin/AdminDataProvider'
import React, { useEffect } from 'react'

const Index = () => {

  const { getTermsAndConditionsDataAPI, termsAndConditionsData } = useAdmin();

  useEffect(() => {
    if (!termsAndConditionsData) {
      getTermsAndConditionsDataAPI()
    }
  }, [termsAndConditionsData])

  return (
    <div className='privacy-container'>
      <div className='privacy-title'>
        {termsAndConditionsData && termsAndConditionsData.title}
      </div>
      <div className="privacy-description">
        {termsAndConditionsData && <div
          dangerouslySetInnerHTML={{ __html: termsAndConditionsData.description }}
        />
        }
      </div>
    </div>
  )
}

export default Index