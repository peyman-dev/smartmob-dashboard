"use client"
import { Button } from 'antd';
import React, { useTransition } from 'react'

const LoginButton = ({loading}: {
  loading?: boolean
}) => {

  return (
    <Button htmlType='submit' variant='solid' color='blue' loading={loading} className='w-full min-h-14! font-estedad! font-medium' >
        ورود
    </Button>
  )
}

export default LoginButton