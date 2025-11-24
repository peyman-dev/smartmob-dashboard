import { User } from '@/core/types/types'
import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import React from 'react'

const UserEmail = ({contacts}: {contacts: User["contacts"]}) => {

  return (
    <p className='text-xs px'>
        {contacts.email.verify ? <Check className='size-3! text-green-500!'/> : <X className='text-red-500! size-3!'/>}
        <span className={clsx(contacts.email.email ? "" : "text-red-500!")}>
            {contacts.email.email || "اضافه نشده"}
        </span>
    </p>
  )
}

export default UserEmail