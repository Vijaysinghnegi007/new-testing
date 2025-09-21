'use client'

import { useI18n } from '@/contexts/I18nContext'

export default function T({ k, f }) {
  const { t } = useI18n()
  return t(k, f)
}

