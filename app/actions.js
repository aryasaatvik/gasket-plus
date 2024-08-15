'use server'

import gasket from '../gasket'

export async function getLocaleData(locale) {
  gasket.logger.info(`getLocaleData: ${locale} locale requested`)
  const localeData = await fetch(new URL(`/locales/${locale}.json`, process.env.NEXT_PUBLIC_URL))
  return localeData.json()
}