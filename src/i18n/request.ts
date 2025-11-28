// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

type Locale = 'en' | 'fa';

const DEFAULT_LOCALE: Locale = 'en';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = cookieStore.get('locale')?.value as Locale | undefined;

  if (!locale || !['en', 'fa'].includes(locale)) {
    const acceptLanguage = (await headers()).get('accept-language');
    if (acceptLanguage?.includes('fa')) {
      locale = 'fa';
    } else {
      locale = DEFAULT_LOCALE;
    }
  }

  // 3. Final fallback
  locale = ['en', 'fa'].includes(locale) ? locale : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../core/messages/${locale}.json`)).default,
  };
});