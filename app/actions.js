'use server'

import { readFile } from 'fs/promises'
import { resolve } from 'path'
import gasket from '../gasket'

export async function getLocaleData(locale) {
  gasket.logger.info(`getLocaleData: ${locale} locale requested`)
  const localePath = resolve(new URL(`../locales/${locale}.json`, import.meta.url).pathname)
  const localeData = await readFile(localePath, 'utf8')
  return JSON.parse(localeData)
}