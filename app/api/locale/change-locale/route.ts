// src/app/api/set-locale/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { locale } = await request.json();

  if (!['en', 'fa'].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  (await cookies()).set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 سال
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true });
}