'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import { usePathname, useRouter } from 'next/navigation'

const I18nContext = createContext(null)

const MESSAGES = { en, es }
const DEFAULT_LOCALE = 'en'

function getCookieLocale() {
  if (typeof document === 'undefined') return DEFAULT_LOCALE
  const m = document.cookie.match(/(?:^|; )LOCALE=(en|es)/)
  return m ? m[1] : DEFAULT_LOCALE
}

export function I18nProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)

  useEffect(() => {
    setLocaleState(getCookieLocale())
  }, [])

  const messages = useMemo(() => MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE], [locale])

  const t = (key, fallback) => {
    const parts = key.split('.')
    let cur = messages
    for (const p of parts) {
      cur = cur?.[p]
      if (cur == null) break
    }
    if (typeof cur === 'string') return cur
    return fallback ?? key
  }

  const setLocale = (next) => {
    if (!['en','es'].includes(next)) return
    // Route with a prefix to let middleware set the cookie and rewrite
    router.push(`/${next}${pathname}`)
  }

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

