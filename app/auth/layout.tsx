import DynamicAuthHeader from '@/components/templates/auth/common/dynamic-auth-header'
import React, { ReactNode } from 'react'

const layout = ({children}: {
    children: ReactNode
}) => {
  return (
    <main id='auth-template' >
        {children}
    </main>
  )
}

export default layout