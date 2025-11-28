import React from 'react'
import DynamicAuthHeader from '../../templates/auth/common/dynamic-auth-header'
import { Button, Input } from 'antd'
import { useTwoAuthentication } from '@/core/stores/two.athentication.store'

const OTPForm = () => {
  const {setIsOTPSent} = useTwoAuthentication()
  return (
    <form
      className="space-y-4 container md:w-[60%]!  w-full *:w-full! h-dvh flex items-center justify-center! *:max-h-max! flex-col"
      action={"#"}
    >
      <DynamicAuthHeader />
      <div className='flex items-center flex-col gap-2 justify-center my-10'>
        <p className='text-xs text-zinc-500'>لطفا کد 6رقمی ارسال شده را در  وارد کنید</p>
        <Input.OTP length={6}/>
      </div>
      <div className='text-center space-y-2.5!'>
        <Button color='blue' variant='solid' className="w-full h-12! text-white">
    تائید و ادامه
        </Button>
        <Button onClick={() => setIsOTPSent(false)} type='link' color='blue' size="small">
          بازگشت
        </Button>
      </div>
      </form>
  )
}

export default OTPForm