import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'ca'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  localeDetection: true,
});
