import RoleChecker from '@/app/(dashboard)/RoleChecker'
import Index from '@/sections/(dashboard)/models/create'
import React from 'react'

const page = () => {
    return (
        <RoleChecker>
            <Index />
        </RoleChecker>
    )
}

export default page