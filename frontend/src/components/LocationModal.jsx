import { useState, useEffect, useMemo } from 'react'
import {
  POPULAR_CITIES,
  POPULAR_LOCATIONS,
  searchLocations,
  saveLocation,
  requestGpsLocation,
  getSavedLocation,
} from '../utils/locationService'
import './LocationModal.css'

export default function LocationModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState(() => getSavedLocation().city || 'Jhansi')
  const [isGpsLoading, setIsGpsLoading] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchLocations(searchQuery)
  }, [searchQuery])

  const cityLocalities = useMemo(() => {
    return POPULAR_LOCATIONS.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase())
  }, [selectedCity])

  if (!isOpen) return null

  const handleChooseLocation = (fullLoc, city, area, coords = null) => {
    saveLocation(fullLoc, city, area, coords)
    if (onSelect) onSelect(fullLoc, city, area)
    onClose()
  }

  const handleGpsDetect = () => {
    setIsGpsLoading(true)
    requestGpsLocation(
      (res) => {
        setIsGpsLoading(false)
        if (res && res.location) {
          handleChooseLocation(res.location, res.city, res.area, res.coords)
        }
      },
      () => {
        setIsGpsLoading(false)
      }
    )
  }

  return (
    <div className="loc-modal-overlay notranslate" translate="no" onClick={onClose} role="dialog" aria-modal="true">
      <div className="loc-modal-card notranslate" translate="no" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="loc-modal-header">
          <div className="loc-modal-title-wrap">
            <span className="loc-modal-icon">📍</span>
            <div>
              <h3>Choose Your Location / स्थान चुनें</h3>
              <p>Find verified workers and fast doorstep service in your area</p>
            </div>
          </div>
          <button type="button" className="loc-modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {/* GPS Button */}
        <div className="loc-modal-gps-block">
          <button
            type="button"
            className="loc-gps-btn"
            onClick={handleGpsDetect}
            disabled={isGpsLoading}
          >
            <div className="loc-gps-left">
              <span className={`loc-radar-dot ${isGpsLoading ? 'pulsing' : ''}`} />
              <div className="loc-gps-text">
                <strong>{isGpsLoading ? 'Detecting Your Exact GPS...' : 'Use Current Location'}</strong>
                <small>Auto-detect area via device GPS / WiFi</small>
              </div>
            </div>
            <span className="loc-gps-arrow">⚡ Detect</span>
          </button>
        </div>


        {/* Search Box */}
        <div className="loc-search-wrap">
          <svg className="loc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input

            type="text"
            className="loc-search-input"
            placeholder="Search city or locality (e.g. Meerut, Noida, Saket)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button type="button" className="loc-search-clear" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Search Results (if typing) */}
        {searchQuery.trim() ? (
          <div className="loc-search-results">
            {searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  className="loc-search-item"
                  onClick={() => handleChooseLocation(res.label, res.city, res.area, res.lat ? { latitude: res.lat, longitude: res.lon } : null)}
                >
                  <span className="loc-pin">📍</span>
                  <div className="loc-item-text">
                    <strong>{res.area ? res.area : res.city}</strong>
                    <small>{res.area ? `${res.city}` : 'Full City Directory'}</small>
                  </div>
                  <span className="loc-select-arrow">Select →</span>
                </button>
              ))
            ) : (
              <div className="loc-no-results">
                <p>No exact area matched for "{searchQuery}".</p>
                <button
                  type="button"
                  className="loc-use-custom-btn"
                  onClick={() => handleChooseLocation(searchQuery.trim(), searchQuery.trim(), '')}
                >
                  Set custom location to: <b>"{searchQuery.trim()}"</b>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal View: Popular Cities & Localities */
          <div className="loc-browse-content">
            {/* City Tabs */}
            <div className="loc-cities-label">POPULAR CITIES</div>
            <div className="loc-cities-chips">
              {POPULAR_CITIES.map((c) => {
                const isSelected = selectedCity.toLowerCase() === c.toLowerCase()
                return (
                  <button
                    key={c}
                    type="button"
                    className={`loc-city-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedCity(c)}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            {/* Localities in selected city */}
            <div className="loc-localities-section">
              <div className="loc-localities-header">
                <span>POPULAR AREAS IN <b>{selectedCity}</b>:</span>
                <button
                  type="button"
                  className="loc-select-entire-city"
                  onClick={() => handleChooseLocation(selectedCity, selectedCity, '')}
                >
                  Select entire {selectedCity} →
                </button>
              </div>

              <div className="loc-localities-grid">
                {cityLocalities.length > 0 ? (
                  cityLocalities.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="loc-locality-pill"
                      onClick={() => handleChooseLocation(`${item.area}, ${item.city}`, item.city, item.area, { latitude: item.lat, longitude: item.lon })}
                    >
                      <span className="loc-sub-pin">✦</span>
                      <span>{item.area}</span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    className="loc-locality-pill primary"
                    onClick={() => handleChooseLocation(selectedCity, selectedCity, '')}
                  >
                    📍 {selectedCity} (Citywide Service)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
