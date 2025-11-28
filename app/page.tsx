import React from 'react'
import HomePage from './(home)/page'
import { getStatistics } from '@/core/actions'

const page = async () => {
  const statistics = await getStatistics() 
  return <HomePage statistics={statistics?.data}/>
}

export default page