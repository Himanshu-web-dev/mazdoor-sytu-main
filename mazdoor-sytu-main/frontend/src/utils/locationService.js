/**
 * Mazdoor Sytu — Automatic Instant Geolocation Service
 * Fast two-tier detection:
 * 1. Instant IP-based lookup (no permission prompt required, resolves in milliseconds)
 * 2. High-accuracy GPS via navigator.geolocation with free reverse-geocoding to exact locality
 */

const STORAGE_KEY_LOCATION = 'mazdoor_user_location'
const STORAGE_KEY_CITY = 'mazdoor_user_city'
const STORAGE_KEY_AREA = 'mazdoor_user_area'
const STORAGE_KEY_COORDS = 'mazdoor_user_coords'

export const MEERUT_LOCALITIES = [
  { id: 'ganga-sagar', name: 'Ganga Sagar', distKm: 0.0, lat: 29.005, lon: 77.752 },
  { id: 'ganga-nagar', name: 'Ganga Nagar', distKm: 1.2, lat: 29.009, lon: 77.758 },
  { id: 'shastri-nagar', name: 'Shastri Nagar', distKm: 4.5, lat: 28.975, lon: 77.725 },
  { id: 'saket', name: 'Saket', distKm: 3.2, lat: 28.985, lon: 77.715 },
  { id: 'civil-lines', name: 'Civil Lines', distKm: 3.8, lat: 28.995, lon: 77.705 },
  { id: 'sadar-bazar', name: 'Sadar Bazar', distKm: 4.2, lat: 28.990, lon: 77.695 },
  { id: 'begum-bridge', name: 'Begum Bridge', distKm: 3.6, lat: 28.987, lon: 77.700 },
  { id: 'abu-lane', name: 'Abu Lane', distKm: 3.9, lat: 28.988, lon: 77.702 },
  { id: 'suraj-kund', name: 'Suraj Kund', distKm: 2.8, lat: 28.980, lon: 77.720 },
  { id: 'cantt', name: 'Meerut Cantt', distKm: 3.5, lat: 29.010, lon: 77.705 },
  { id: 'hapur-stand', name: 'Hapur Stand', distKm: 4.0, lat: 28.968, lon: 77.715 },
  { id: 'jagriti-vihar', name: 'Jagriti Vihar', distKm: 4.8, lat: 28.965, lon: 77.740 },
  { id: 'brahmpuri', name: 'Brahmpuri', distKm: 5.5, lat: 28.975, lon: 77.690 },
  { id: 'transport-nagar', name: 'Transport Nagar', distKm: 7.2, lat: 28.950, lon: 77.680 },
  { id: 'baghpat-road', name: 'Baghpat Road', distKm: 7.8, lat: 28.978, lon: 77.665 },
  { id: 'kankerkhera', name: 'Kankerkhera', distKm: 8.5, lat: 29.015, lon: 77.675 },
  { id: 'roorkee-road', name: 'Roorkee Road', distKm: 6.8, lat: 29.030, lon: 77.700 },
  { id: 'pallavpuram', name: 'Pallavpuram', distKm: 7.5, lat: 29.045, lon: 77.710 },
  { id: 'modipuram', name: 'Modipuram', distKm: 9.2, lat: 29.065, lon: 77.705 },
  { id: 'partapur', name: 'Partapur', distKm: 9.8, lat: 28.935, lon: 77.665 },
]

export function findNearestMeerutColony(lat, lon) {
  if (!lat || !lon) return 'Ganga Sagar'
  let closest = MEERUT_LOCALITIES[0]
  let minDiff = Infinity
  for (const loc of MEERUT_LOCALITIES) {
    if (loc.lat && loc.lon) {
      const dLat = loc.lat - lat
      const dLon = loc.lon - lon
      const distSq = dLat * dLat + dLon * dLon
      if (distSq < minDiff) {
        minDiff = distSq
        closest = loc
      }
    }
  }
  return closest.name
}

export function getSavedLocation() {
  try {
    let loc = localStorage.getItem(STORAGE_KEY_LOCATION) || ''
    let city = localStorage.getItem(STORAGE_KEY_CITY) || 'Meerut'
    let area = localStorage.getItem(STORAGE_KEY_AREA) || ''
    const coordsStr = localStorage.getItem(STORAGE_KEY_COORDS)
    const coords = coordsStr ? JSON.parse(coordsStr) : null

    // Never allow area to be identical to city (prevents "Meerut, Meerut")
    if (!area || area.toLowerCase() === city.toLowerCase() || area === 'Nearby Area') {
      area = 'Ganga Sagar'
    }
    if (!loc || loc === 'Meerut, Meerut' || loc === 'Meerut' || loc.includes('Nearby Area')) {
      loc = `${area}, ${city}`
    }

    return {
      location: loc,
      city: city,
      area: area,
      coords,
    }
  } catch {
    return {
      location: 'Ganga Sagar, Meerut',
      city: 'Meerut',
      area: 'Ganga Sagar',
      coords: null,
    }
  }
}

export function saveLocation(fullLocation, city = '', area = '', coords = null) {
  try {
    const effectiveCity = city || 'Meerut'
    let effectiveArea = area
    if (!effectiveArea || effectiveArea.toLowerCase() === effectiveCity.toLowerCase()) {
      effectiveArea = 'Ganga Sagar'
    }
    const effectiveFull = `${effectiveArea}, ${effectiveCity}`

    localStorage.setItem(STORAGE_KEY_LOCATION, effectiveFull)
    localStorage.setItem(STORAGE_KEY_CITY, effectiveCity)
    localStorage.setItem(STORAGE_KEY_AREA, effectiveArea)
    if (coords) localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(coords))
    
    // Dispatch custom event for real-time reactive updates across components
    window.dispatchEvent(
      new CustomEvent('mazdoor_location_updated', {
        detail: {
          location: effectiveFull,
          city: effectiveCity,
          area: effectiveArea,
          coords,
        },
      })
    )
  } catch (err) {
    console.warn('Could not save location to localStorage', err)
  }
}

/**
 * Fetch fast IP-based location without requiring browser permission prompt
 */
async function fetchIpLocation() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch('https://ipwho.is/', { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error('IP service responded with error')
    const data = await res.json()

    if (data && data.success !== false && (data.city || data.region)) {
      const city = data.city || data.region || ''
      const region = data.region && data.region !== city ? `, ${data.region}` : ''
      const fullLoc = `${city}${region}`.trim()
      const coords = { latitude: data.latitude, longitude: data.longitude }
      return { location: fullLoc, city, coords }
    }
  } catch {
    // Secondary fallback
    try {
      const res2 = await fetch('https://ipapi.co/json/')
      const data2 = await res2.json()
      if (data2 && (data2.city || data2.region)) {
        const city = data2.city || data2.region || ''
        const fullLoc = `${city}, ${data2.region || ''}`.trim()
        const coords = { latitude: data2.latitude, longitude: data2.longitude }
        return { location: fullLoc, city, coords }
      }
    } catch {
      // Ignored
    }
  }
  return null
}

/**
 * Reverse geocode GPS coordinates to human-readable neighborhood & city
 */
async function reverseGeocodeCoords(lat, lon) {
  try {
    // If user's GPS coordinates are within Greater Meerut (lat: 28.85 - 29.15, lon: 77.60 - 77.85)
    if (lat >= 28.85 && lat <= 29.15 && lon >= 77.60 && lon <= 77.85) {
      const colony = findNearestMeerutColony(lat, lon)
      return {
        location: `${colony}, Meerut`,
        city: 'Meerut',
        area: colony,
        coords: { latitude: lat, longitude: lon },
      }
    }

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    )
    if (res.ok) {
      const data = await res.json()
      const locality = data.locality || data.subLocality || data.neighbourhood || ''
      const city = data.city || data.principalSubdivision || 'Meerut'
      let area = locality
      if (!area || area.toLowerCase() === city.toLowerCase() || area === 'Nearby Area') {
        area = 'Ganga Sagar'
      }

      let formatted = `${area}, ${city}`

      return {
        location: formatted,
        city: city,
        area: area,
        coords: { latitude: lat, longitude: lon },
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err)
  }
  return null
}

/**
 * Interactive explicit GPS pinpointing (triggered by user button click)
 */
export function requestGpsLocation(onSuccess, onError) {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    if (onError) onError('Geolocation not supported by browser')
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords
      const res = await reverseGeocodeCoords(latitude, longitude)
      if (res) {
        saveLocation(res.location, res.city, res.area, res.coords)
        if (onSuccess) onSuccess(res)
      } else {
        if (onError) onError('Could not reverse geocode coordinates')
      }
    },
    (err) => {
      if (onError) onError(err?.message || 'Location permission denied')
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

/**
 * Main auto-detection entry point.
 * Calls onLocationUpdate callback as soon as either IP or GPS location resolves.
 */
export async function autoDetectLocation(onLocationUpdate) {
  // 1. Fast path: check cached location in storage
  const saved = getSavedLocation()
  if (saved.location && onLocationUpdate) {
    onLocationUpdate(saved.location, saved.city, 'cache', saved.area)
  }

  // 2. Instant IP-based lookup (no permission popup needed, works immediately)
  fetchIpLocation().then((ipLoc) => {
    if (ipLoc && ipLoc.location) {
      const savedArea = getSavedLocation().area || 'Shastri Nagar'
      const fullLoc = `${savedArea}, ${ipLoc.city || 'Meerut'}`
      saveLocation(fullLoc, ipLoc.city, savedArea, ipLoc.coords)
      if (onLocationUpdate) {
        onLocationUpdate(fullLoc, ipLoc.city, 'ip', savedArea)
      }
    }
  }).catch(() => {})

  // 3. Browser GPS Geolocation (High Precision)
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const gpsLoc = await reverseGeocodeCoords(latitude, longitude)
        if (gpsLoc && gpsLoc.location) {
          saveLocation(gpsLoc.location, gpsLoc.city, gpsLoc.area, gpsLoc.coords)
          if (onLocationUpdate) {
            onLocationUpdate(gpsLoc.location, gpsLoc.city, 'gps', gpsLoc.area)
          }
        }
      },
      (err) => {
        console.info('GPS permission not granted or unavailable, using IP location:', err?.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    )
  }
}
