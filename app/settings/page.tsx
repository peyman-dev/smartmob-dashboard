export const dynamic = "force-dynamic";
export const revalidate = 0;
import SettingField from '@/components/templates/settings/setting-field';
import { getSettings } from '@/core/actions';
import { Setting, SettingsArray } from '@/core/types/types';
import React from 'react'

const page =  async () => {
  const res = await getSettings()
  const settings: SettingsArray = await res?.data

  console.log(settings)
  return (
    <div className='space-y-10 max-w-3xl mx-auto text-sm'>
      {settings.map((setting: Setting) => <SettingField  setting={setting} key={setting?.name}/>)}
    </div>
  )
}

export default page