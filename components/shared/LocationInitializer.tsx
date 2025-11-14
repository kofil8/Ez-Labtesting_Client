'use client'

import { useEffect } from 'react'
import {
  LOCATION_PROMPT_FLAG,
  LOCATION_STORAGE_KEY,
  LOCATION_UPDATED_EVENT,
  type StoredLocation,
} from './LocationSelector'

export function LocationInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const saved = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (saved) {
      return
    }

    const hasPrompted = localStorage.getItem(LOCATION_PROMPT_FLAG)
    if (hasPrompted) {
      return
    }

    if (!('geolocation' in navigator)) {
      localStorage.setItem(LOCATION_PROMPT_FLAG, 'true')
      return
    }

    localStorage.setItem(LOCATION_PROMPT_FLAG, 'true')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        ;(async () => {
          const { latitude, longitude } = position.coords

          let derivedZip: string | undefined
          let derivedState: string | undefined

          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )

            if (response.ok) {
              const data = await response.json()
              derivedZip = data.postcode ?? undefined
              derivedState = data.principalSubdivision ?? data.countryName ?? undefined
            }
          } catch (error) {
            console.error('Reverse geocoding failed during initialization', error)
          }

          const payload: StoredLocation = {
            method: 'geolocation',
            zipCode: derivedZip,
            state: derivedState,
            latitude,
            longitude,
            resolvedAt: new Date().toISOString(),
          }

          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload))
          window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT))
        })()
      },
      (error) => {
        console.warn('Initial geolocation request failed:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    )
  }, [])

  return null
}


