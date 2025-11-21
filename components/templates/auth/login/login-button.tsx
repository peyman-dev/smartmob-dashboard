"use client"
import { Button } from 'antd';
import React, { useTransition } from 'react'

const LoginButton = ({onSubmit}: {
    onSubmit: () => void;
}) => {
    const [isPending, startTransition] = useTransition()
    const handleClick = () => {
        startTransition(async () => await onSubmit())
    }
  return (
    <Button variant='solid' color='blue' loading={isPending} className='w-full min-h-14! font-estedad! font-medium' >
        ورود
    </Button>
  )
}

export default LoginButton