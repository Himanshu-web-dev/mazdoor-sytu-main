/**
 * Mazdoor Sytu — Automatic Instant Geolocation & Hyperlocal Service
 * 1. Instant IP-based lookup (resolves within milliseconds without browser prompt)
 * 2. High-accuracy GPS via navigator.geolocation with clean reverse-geocoding
 * 3. Multi-tier reverse-geocoding (Photon Komoot -> OpenStreetMap Nominatim -> BigDataCloud)
 * 4. Preloaded database of popular Indian cities & localities for instant search with zero latency
 */

const STORAGE_KEY_LOCATION = 'mazdoor_user_location'
const STORAGE_KEY_CITY = 'mazdoor_user_city'
const STORAGE_KEY_AREA = 'mazdoor_user_area'
const STORAGE_KEY_COORDS = 'mazdoor_user_coords'

export const POPULAR_CITIES = [
  'Jhansi',
  'Meerut',
  'Noida',
  'Greater Noida',
  'Delhi',
  'Gurgaon',
  'Ghaziabad',
  'Faridabad',
  'Lucknow',
  'Kanpur',
  'Agra',
  'Varanasi',
  'Prayagraj',
  'Bareilly',
  'Moradabad',
  'Aligarh',
  'Dehradun',
  'Haridwar',
  'Jaipur',
  'Chandigarh',
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Hyderabad',
]

export const POPULAR_LOCATIONS = [
  // Jhansi (Bundelkhand Hub)
  { area: 'Sadar Bazar', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4358, lon: 78.5684 },
  { area: 'Sipri Bazar', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4510, lon: 78.5520 },
  { area: 'Civil Lines', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4540, lon: 78.5780 },
  { area: 'Elite Chauraha', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4480, lon: 78.5720 },
  { area: 'BKD Chauraha', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4500, lon: 78.5750 },
  { area: 'Nawabad', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4420, lon: 78.5800 },
  { area: 'Manik Chowk', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4580, lon: 78.5860 },
  { area: 'Hansari', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4120, lon: 78.5450 },
  { area: 'Medical College Road', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4250, lon: 78.5600 },
  { area: 'Nagra', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4600, lon: 78.5400 },
  { area: 'Premnagar', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4650, lon: 78.5300 },
  { area: 'Jhansi Cantt', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4280, lon: 78.5750 },
  { area: 'Kochhabhanwar', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4750, lon: 78.5900 },
  { area: 'Gwalior Road', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4800, lon: 78.5600 },
  { area: 'Kanpur Road', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4620, lon: 78.6050 },
  { area: 'Talpura', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4410, lon: 78.5920 },
  { area: 'Shivpuri Road', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4380, lon: 78.5450 },
  { area: 'Khati Baba', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4560, lon: 78.5680 },
  { area: 'Isagarh Road', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4450, lon: 78.5580 },
  { area: 'Jhansi Fort Area', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4580, lon: 78.5780 },
  { area: 'Panchvati', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4510, lon: 78.5830 },
  { area: 'Bundelkhand University Area', city: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4600, lon: 78.6000 },

  // Meerut
  { area: 'Shastri Nagar', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.975, lon: 77.725 },
  { area: 'Ganga Nagar', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.009, lon: 77.758 },
  { area: 'Saket', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.985, lon: 77.715 },
  { area: 'Civil Lines', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.995, lon: 77.705 },
  { area: 'Sadar Bazar', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.990, lon: 77.695 },
  { area: 'Begum Bridge', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.987, lon: 77.700 },
  { area: 'Abu Lane', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.988, lon: 77.702 },
  { area: 'Meerut Cantt', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.010, lon: 77.705 },
  { area: 'Jagriti Vihar', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.965, lon: 77.740 },
  { area: 'Pallavpuram', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.045, lon: 77.710 },
  { area: 'Kankerkhera', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.015, lon: 77.675 },
  { area: 'Modipuram', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.065, lon: 77.705 },
  { area: 'Baghpat Road', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.978, lon: 77.665 },
  { area: 'Partapur', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.935, lon: 77.665 },
  { area: 'Ganga Sagar', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.005, lon: 77.752 },
  { area: 'Suraj Kund', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.980, lon: 77.720 },
  { area: 'Hapur Stand', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.968, lon: 77.715 },
  { area: 'Brahmpuri', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.975, lon: 77.690 },
  { area: 'Transport Nagar', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.950, lon: 77.680 },
  { area: 'Roorkee Road', city: 'Meerut', state: 'Uttar Pradesh', lat: 29.030, lon: 77.700 },

  // Noida & Greater Noida
  { area: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', lat: 28.570, lon: 77.322 },
  { area: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', lat: 28.625, lon: 77.365 },
  { area: 'Sector 15', city: 'Noida', state: 'Uttar Pradesh', lat: 28.583, lon: 77.313 },
  { area: 'Sector 137', city: 'Noida', state: 'Uttar Pradesh', lat: 28.512, lon: 77.408 },
  { area: 'Barola', city: 'Noida', state: 'Uttar Pradesh', lat: 28.545, lon: 77.382 },
  { area: 'Pari Chowk', city: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.468, lon: 77.504 },
  { area: 'Gaur City', city: 'Greater Noida', state: 'Uttar Pradesh', lat: 28.608, lon: 77.432 },

  // Delhi NCR
  { area: 'Connaught Place', city: 'Delhi', state: 'Delhi', lat: 28.631, lon: 77.216 },
  { area: 'Karol Bagh', city: 'Delhi', state: 'Delhi', lat: 28.652, lon: 77.190 },
  { area: 'Rohini', city: 'Delhi', state: 'Delhi', lat: 28.715, lon: 77.118 },
  { area: 'Dwarka', city: 'Delhi', state: 'Delhi', lat: 28.582, lon: 77.050 },
  { area: 'Lajpat Nagar', city: 'Delhi', state: 'Delhi', lat: 28.568, lon: 77.243 },
  { area: 'Hauz Khas', city: 'Delhi', state: 'Delhi', lat: 28.549, lon: 77.206 },
  { area: 'Saket', city: 'Delhi', state: 'Delhi', lat: 28.524, lon: 77.206 },
  { area: 'Mayur Vihar', city: 'Delhi', state: 'Delhi', lat: 28.608, lon: 77.298 },

  // Gurgaon (Gurugram)
  { area: 'Cyber Hub', city: 'Gurgaon', state: 'Haryana', lat: 28.495, lon: 77.089 },
  { area: 'Sector 29', city: 'Gurgaon', state: 'Haryana', lat: 28.468, lon: 77.063 },
  { area: 'Golf Course Road', city: 'Gurgaon', state: 'Haryana', lat: 28.455, lon: 77.098 },
  { area: 'Sohna Road', city: 'Gurgaon', state: 'Haryana', lat: 28.418, lon: 77.042 },

  // Ghaziabad
  { area: 'Indirapuram', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.642, lon: 77.371 },
  { area: 'Vaishali', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.648, lon: 77.342 },
  { area: 'Vasundhara', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.665, lon: 77.366 },
  { area: 'Raj Nagar Extension', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.704, lon: 77.442 },

  // Dehradun
  { area: 'Rajpur Road', city: 'Dehradun', state: 'Uttarakhand', lat: 30.345, lon: 78.065 },
  { area: 'Clock Tower', city: 'Dehradun', state: 'Uttarakhand', lat: 30.324, lon: 78.042 },
  { area: 'Jakhan', city: 'Dehradun', state: 'Uttarakhand', lat: 30.368, lon: 78.072 },
  { area: 'Paltan Bazar', city: 'Dehradun', state: 'Uttarakhand', lat: 30.318, lon: 78.038 },

  // Lucknow
  { area: 'Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.852, lon: 80.998 },
  { area: 'Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.846, lon: 80.946 },
  { area: 'Alambagh', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.815, lon: 80.905 },

  // Kanpur
  { area: 'Swaroop Nagar', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.478, lon: 80.312 },
  { area: 'Kakadeo', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.482, lon: 80.301 },
  { area: 'Civil Lines', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.468, lon: 80.352 },

  // Agra
  { area: 'Tajganj', city: 'Agra', state: 'Uttar Pradesh', lat: 27.165, lon: 78.042 },
  { area: 'Sanjay Place', city: 'Agra', state: 'Uttar Pradesh', lat: 27.195, lon: 78.005 },
  { area: 'Kamla Nagar', city: 'Agra', state: 'Uttar Pradesh', lat: 27.218, lon: 78.012 },

  // Bengaluru
  { area: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka', lat: 12.978, lon: 77.640 },
  { area: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', lat: 12.935, lon: 77.624 },
  { area: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', lat: 12.969, lon: 77.750 },
  { area: 'HSR Layout', city: 'Bengaluru', state: 'Karnataka', lat: 12.912, lon: 77.644 },

  // Mumbai
  { area: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', lat: 19.119, lon: 72.846 },
  { area: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', lat: 19.059, lon: 72.829 },
  { area: 'Powai', city: 'Mumbai', state: 'Maharashtra', lat: 19.117, lon: 72.905 },
]

export const JHANSI_LOCALITIES = POPULAR_LOCATIONS.filter((l) => l.city === 'Jhansi').map((l, i) => ({
  id: `jhansi-${i}`,
  name: l.area,
  lat: l.lat,
  lon: l.lon,
  distKm: 0.0,
}))

export function findNearestJhansiColony(lat, lon) {
  if (!lat || !lon) return 'Elite Chauraha'
  let closest = JHANSI_LOCALITIES[0]
  let minDiff = Infinity
  for (const loc of JHANSI_LOCALITIES) {
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
  return closest ? closest.name : 'Elite Chauraha'
}

export const MEERUT_LOCALITIES = POPULAR_LOCATIONS.filter((l) => l.city === 'Meerut').map((l, i) => ({
  id: `meerut-${i}`,
  name: l.area,
  lat: l.lat,
  lon: l.lon,
  distKm: 0.0,
}))

export function findNearestMeerutColony(lat, lon) {
  if (!lat || !lon) return 'Shastri Nagar'
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

/**
 * Instant local search through cities & areas
 */
export function searchLocations(query) {
  const q = (query || '').toLowerCase().trim()
  if (!q) {
    return POPULAR_CITIES.map((c) => ({
      label: c,
      city: c,
      area: '',
      isCity: true,
    }))
  }

  const results = []

  // Check cities first
  POPULAR_CITIES.forEach((c) => {
    if (c.toLowerCase().includes(q)) {
      results.push({
        label: c,
        city: c,
        area: '',
        isCity: true,
      })
    }
  })

  // Check specific areas
  POPULAR_LOCATIONS.forEach((loc) => {
    const full = `${loc.area}, ${loc.city}`
    if (
      loc.area.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      full.toLowerCase().includes(q)
    ) {
      results.push({
        label: full,
        city: loc.city,
        area: loc.area,
        isCity: false,
        lat: loc.lat,
        lon: loc.lon,
      })
    }
  })

  return results.slice(0, 8)
}

export function getSavedLocation() {
  try {
    let loc = localStorage.getItem(STORAGE_KEY_LOCATION) || ''
    let city = localStorage.getItem(STORAGE_KEY_CITY) || ''
    let area = localStorage.getItem(STORAGE_KEY_AREA) || ''
    const coordsStr = localStorage.getItem(STORAGE_KEY_COORDS)
    const coords = coordsStr ? JSON.parse(coordsStr) : null

    // Clean up stale or corrupted entries from previous bugs (e.g. Dehradun or street names forced by ISP)
    const isCorrupted =
      loc.includes('lane') ||
      loc.includes('road,') ||
      loc.includes('street') ||
      loc.includes('chowk') ||
      loc === 'Dehradun' ||
      loc.startsWith('Dehradun') ||
      city === 'Dehradun'

    if (isCorrupted) {
      try {
        localStorage.removeItem(STORAGE_KEY_LOCATION)
        localStorage.removeItem(STORAGE_KEY_CITY)
        localStorage.removeItem(STORAGE_KEY_AREA)
        localStorage.removeItem(STORAGE_KEY_COORDS)
      } catch {}
      return {
        location: 'Meerut',
        city: 'Meerut',
        area: '',
        coords: null,
      }
    }

    if (!loc) {
      return {
        location: 'Meerut',
        city: 'Meerut',
        area: '',
        coords: null,
      }
    }

    if (area && city && area.toLowerCase() === city.toLowerCase()) {
      area = ''
      loc = city
    }

    return {
      location: loc,
      city: city || loc,
      area: area,
      coords,
    }
  } catch {
    return {
      location: 'Meerut',
      city: 'Meerut',
      area: '',
      coords: null,
    }
  }
}

export function saveLocation(fullLocation, city = '', area = '', coords = null) {
  try {
    let cleanCity = (city || '').trim()
    let cleanArea = (area || '').trim()

    // Filter out street/road names from being saved as areas
    const isStreetName = /(lane|road|street|gali|marg|path|highway|expressway|chowk|bypass)$/i.test(cleanArea)
    if (isStreetName) {
      cleanArea = ''
    }

    if (cleanArea && cleanCity && cleanArea.toLowerCase() === cleanCity.toLowerCase()) {
      cleanArea = ''
    }

    let cleanFull = ''
    if (cleanArea && cleanCity) {
      cleanFull = `${cleanArea}, ${cleanCity}`
    } else {
      cleanFull = cleanCity || cleanArea || fullLocation || ''
    }

    if (!cleanFull) return

    localStorage.setItem(STORAGE_KEY_LOCATION, cleanFull)
    if (cleanCity) localStorage.setItem(STORAGE_KEY_CITY, cleanCity)
    if (cleanArea) localStorage.setItem(STORAGE_KEY_AREA, cleanArea)
    else localStorage.removeItem(STORAGE_KEY_AREA)
    if (coords) localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(coords))

    window.dispatchEvent(
      new CustomEvent('mazdoor_location_updated', {
        detail: {
          location: cleanFull,
          city: cleanCity || cleanFull,
          area: cleanArea,
          coords,
        },
      })
    )
  } catch (err) {
    console.warn('Could not save location to localStorage', err)
  }
}

/**
 * Reverse geocode GPS coordinates to clean neighborhood & city
 * Filters out raw street/lane names, returns recognizable localities
 */
export async function reverseGeocodeCoords(lat, lon) {
  if (!lat || !lon) return null

  // 1. If coordinates are in Jhansi region, snap to nearest recognizable locality
  if (lat >= 25.35 && lat <= 25.56 && lon >= 78.46 && lon <= 78.68) {
    const colony = findNearestJhansiColony(lat, lon)
    return {
      location: `${colony}, Jhansi`,
      city: 'Jhansi',
      area: colony,
      coords: { latitude: lat, longitude: lon },
    }
  }

  // 2. If coordinates are in Greater Meerut, pick closest recognizable locality
  if (lat >= 28.85 && lat <= 29.12 && lon >= 77.58 && lon <= 77.85) {
    const colony = findNearestMeerutColony(lat, lon)
    return {
      location: `${colony}, Meerut`,
      city: 'Meerut',
      area: colony,
      coords: { latitude: lat, longitude: lon },
    }
  }

  // 2. Primary: Photon OpenStreetMap Reverse Geocoder
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const feature = data?.features?.[0]
      if (feature && feature.properties) {
        const p = feature.properties
        const city = p.city || p.town || p.village || p.county || p.state || ''

        // Strictly pick recognized locality, suburb, or district
        let area = p.suburb || p.district || p.neighbourhood || p.locality || ''

        // Never accept a street/road name as an area
        const isStreet = p.type === 'street' || p.osm_key === 'highway' || /(lane|road|street|gali|marg|chowk|bypass|path)$/i.test(area)
        if (isStreet) {
          area = ''
        }

        if (area && city && area.toLowerCase() === city.toLowerCase()) {
          area = ''
        }

        const fullLoc = area && city ? `${area}, ${city}` : (city || area || '')
        if (fullLoc) {
          return {
            location: fullLoc,
            city: city || fullLoc,
            area: area || '',
            coords: { latitude: lat, longitude: lon },
          }
        }
      }
    }
  } catch {}

  // 3. Fallback: BigDataCloud Reverse Geocoding
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const city = data.city || data.principalSubdivision || ''
      let area = data.locality || ''
      if (/(lane|road|street|gali|marg|chowk|bypass|path)$/i.test(area)) {
        area = ''
      }
      if (area && city && area.toLowerCase() === city.toLowerCase()) {
        area = ''
      }
      const fullLoc = area && city ? `${area}, ${city}` : (city || area || '')
      if (fullLoc) {
        return {
          location: fullLoc,
          city: city || fullLoc,
          area: area || '',
          coords: { latitude: lat, longitude: lon },
        }
      }
    }
  } catch {}

  return null
}

/**
 * Fetch fast IP-based location without requiring browser permission prompt
 * Uses ipinfo.io as primary Tier-1 API (accurate for Reliance Jio and Airtel in India)
 */
async function fetchIpLocation() {
  // 1. Primary IP API: ipinfo.io
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const res = await fetch('https://ipinfo.io/json', { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data && data.city) {
        const city = data.city
        let coords = null
        if (data.loc) {
          const [latStr, lonStr] = data.loc.split(',')
          const lat = parseFloat(latStr)
          const lon = parseFloat(lonStr)
          if (!isNaN(lat) && !isNaN(lon)) {
            coords = { latitude: lat, longitude: lon }
          }
        }
        return {
          location: city,
          city: city,
          area: '',
          coords,
        }
      }
    }
  } catch {}

  // 2. Secondary IP API: api.ipapi.is
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const res = await fetch('https://api.ipapi.is', { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data?.city) {
        const city = data.city
        const coords = (data.lat && data.lon) ? { latitude: data.lat, longitude: data.lon } : null
        return {
          location: city,
          city: city,
          area: '',
          coords,
        }
      }
    }
  } catch {}

  // 3. Fallback: Default to Meerut (Core Platform Hub)
  return {
    location: 'Meerut',
    city: 'Meerut',
    area: '',
    coords: null,
  }
}

/**
 * Interactive explicit GPS pinpointing (triggered by user button click)
 */
export function requestGpsLocation(onSuccess, onError) {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    if (onError) onError('Geolocation not supported by your browser')
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords
      // If accuracy is worse than 8000m, it's an ISP gateway estimate on desktop
      if (accuracy && accuracy > 8000) {
        if (onError) {
          onError('Desktop GPS accuracy is too low (cellular/ISP tower estimate). Please choose your city directly.')
        }
        return
      }

      const res = await reverseGeocodeCoords(latitude, longitude)
      if (res && res.location) {
        saveLocation(res.location, res.city, res.area, res.coords)
        if (onSuccess) onSuccess(res)
      } else {
        const fallback = {
          location: `Jhansi`,
          city: 'Jhansi',
          area: '',
          coords: { latitude, longitude },
        }
        saveLocation(fallback.location, fallback.city, '', fallback.coords)
        if (onSuccess) onSuccess(fallback)
      }
    },
    (err) => {
      let friendlyMsg = 'Browser location permission blocked hai. Kripya neeche Popular Cities me se apna shahar chunein.'
      if (err?.code === 1 || (err?.message && /denied/i.test(err.message))) {
        friendlyMsg = 'Browser me location permission blocked hai. Kripya neeche Popular Cities me se apna shahar (jaise Jhansi, Meerut, Noida) chunein.'
      } else if (err?.code === 2 || (err?.message && /unavailable/i.test(err.message))) {
        friendlyMsg = 'GPS signal nahi mil pa raha hai. Kripya neeche se apna shahar chunein.'
      } else if (err?.code === 3 || (err?.message && /timeout/i.test(err.message))) {
        friendlyMsg = 'Location fetch karne me samay laga. Kripya neeche se shahar chunein.'
      }
      if (onError) onError(friendlyMsg)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

/**
 * Main auto-detection entry point.
 * Prioritizes saved location, accurate IP lookup, and high-precision GPS.
 */
export async function autoDetectLocation(onLocationUpdate) {
  // 1. Fast path: check valid cached location in storage
  const saved = getSavedLocation()
  if (saved.location) {
    if (onLocationUpdate) {
      onLocationUpdate(saved.location, saved.city, 'cache', saved.area)
    }
    // If the saved location was set by the user or already resolved, do NOT overwrite with background IP!
    if (localStorage.getItem(STORAGE_KEY_LOCATION)) {
      return
    }
  }

  // 2. Instant IP-based lookup (works immediately, no popup prompt)
  fetchIpLocation()
    .then((ipLoc) => {
      if (ipLoc && ipLoc.location) {
        // Only save if storage is still empty
        if (!localStorage.getItem(STORAGE_KEY_LOCATION)) {
          saveLocation(ipLoc.location, ipLoc.city, ipLoc.area, ipLoc.coords)
          if (onLocationUpdate) {
            onLocationUpdate(ipLoc.location, ipLoc.city, 'ip', ipLoc.area)
          }
        }
      }
    })
    .catch(() => {})

  // 3. Browser GPS Geolocation (High Precision)
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        // Ignore coarse desktop estimates (> 5000m) that misidentify regional gateways
        if (accuracy && accuracy > 5000) {
          return
        }

        const gpsLoc = await reverseGeocodeCoords(latitude, longitude)
        if (gpsLoc && gpsLoc.location) {
          saveLocation(gpsLoc.location, gpsLoc.city, gpsLoc.area, gpsLoc.coords)
          if (onLocationUpdate) {
            onLocationUpdate(gpsLoc.location, gpsLoc.city, 'gps', gpsLoc.area)
          }
        }
      },
      (err) => {
        // User denied or GPS unavailable, IP location remains active
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    )
  }
}

