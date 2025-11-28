export const dynamic = "force-dynamic";
export const revalidate = 0;
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {
  return redirect('/auth/login')
}

export default page