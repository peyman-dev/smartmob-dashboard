"use client"
import { Button } from 'antd';
import { useTranslations } from 'next-intl';

const LoginButton = ({loading}: {
  loading?: boolean
}) => {
  const t = useTranslations("auth.login")

  return (
    <Button htmlType='submit' variant='solid' color='blue' loading={loading} className='w-full min-h-14! font-estedad! font-medium' >
      {t("login")}
    </Button>
  )
}

export default LoginButton