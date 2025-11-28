"use client"
import { Button } from 'antd';
import React, { useTransition } from 'react'

const LoginButton = ({onSubmit}: {
    onSubmit: () => void;
}) => {
    const [isPending, startTransition] = useTransition()

  return (
    <Button htmlType='submit' variant='solid' color='blue' loading={isPending} className='w-full min-h-14! font-estedad! font-medium' >
        ورود
    </Button>
  )
}

export default LoginButton