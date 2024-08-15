'use server'

import { redirect } from 'next/navigation'
import gasket from '../gasket'
import intlManager from '../intl'

export async function getLocaleData(locale) {
  if (!intlManager.managedLocales.includes(locale)) {
    gasket.logger.error(`getLocaleData: ${locale} locale not found`)
    const resolvedLocale = intlManager.resolveLocale(locale)
    console.log('resolvedLocale', resolvedLocale)
    redirect(`/${resolvedLocale}`)
  }
  gasket.logger.info(`getLocaleData: ${locale} locale requested`)
  const localeData = intlManager.handleLocale(locale).getAllMessages()
  console.log('localeData', localeData)
  return localeData
}