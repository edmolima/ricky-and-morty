'use client'

import { track } from '@vercel/analytics'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    track(metric.name, {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }
  })

  return null
}