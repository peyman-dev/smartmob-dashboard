
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  let locale = cookieStore.get('locale')?.value as 'en' | 'fa';

  if (!locale || !['en', 'fa'].includes(locale)) {
    locale = 'fa';
  }

  const messages = (await import(`./../../../../core/messages/${locale}.json`)).default;

  return NextResponse.json({ messages, locale });
}