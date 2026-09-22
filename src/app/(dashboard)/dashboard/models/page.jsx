import React from 'react'
import Index from '@/sections/(dashboard)/models/view/index'
import RoleChecker from '../../RoleChecker'

const page = () => {
    return (
        <RoleChecker>
            <Index />
        </RoleChecker>
    )
}

export default page