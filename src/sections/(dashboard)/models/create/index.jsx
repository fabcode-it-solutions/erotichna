import HeaderHeading from '@/components/dashboard/HeaderHeading/HeaderHeading'
import React from 'react'
import CreateModelForm from './CreateModelForm'
import MobileHeader from '@/components/dashboard/MobileHeader/MobileHeader'

const Index = () => {
    return (
        <div>
            <HeaderHeading
                title="Models"
                home={true}
                notification={false}
                search={true}
                description="Add a model."
            />
            <MobileHeader heading='Models' />
            <CreateModelForm/>
        </div>
    )
}

export default Index