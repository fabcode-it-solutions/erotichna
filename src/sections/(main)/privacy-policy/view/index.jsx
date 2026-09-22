'use client';
import useAdmin from '@/contexts/admin/AdminDataProvider';
import useTheme from '@/contexts/theme/ThemeProvider';
import React, { useEffect } from 'react'

const Index = () => {
    const { fonts } = useTheme();
    const { getPrivacyPolicyDataAPI, privacyPolicyData } = useAdmin();

    useEffect(() => {
        if (!privacyPolicyData) {
            getPrivacyPolicyDataAPI()
        }
    }, [privacyPolicyData])

    return (
        <div className='privacy-container'>
            <div className='privacy-title'>
                {privacyPolicyData && privacyPolicyData.title}
            </div>
            <div className={`privacy-description ${fonts.cormorant_Garamond_non} `}>
                <div className={`entry-content ${fonts.open_Sans}`}>
                    {privacyPolicyData && <div
                        dangerouslySetInnerHTML={{ __html: privacyPolicyData.description }}
                    />
                    }
                </div>
            </div>
        </div>
    )
}

export default Index