import { SortDesc } from 'lucide-react'
import React from 'react'

const SortOrders = () => {
  return (
    <div className='*:cursor-pointer *:flex *:items-center *:gap-1 *:h-10 *:rounded-lg *:bg-white *:justify-center *:hover:shadow-sm text-xs *:px-3 *:border *:border-zinc-200'>
        <button>
            <SortDesc />
            <span>
                فیلتر
            </span>
        </button>
    </div>
  )
}

export default SortOrders