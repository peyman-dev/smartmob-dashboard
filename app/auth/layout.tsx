import DynamicAuthHeader from '@/components/templates/auth/common/dynamic-auth-header'
import React, { ReactNode } from 'react'

const layout = ({children}: {
    children: ReactNode
}) => {
  return (
    <main id='auth-template' className='w-dvw h-dvh flex items-center justify-center flex-col'>
        <DynamicAuthHeader />
        {children}
    </main>
  )
}

export default layout