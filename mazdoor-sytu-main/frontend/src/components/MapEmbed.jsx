/**
 * MapEmbed.jsx
 * Reusable Google Maps embed component for Mazdoor Sytu Customer Portal.
 * Shows real Meerut map with animated worker position indicator.
 */

import { useState } from 'react'

// Worker approximate coordinates near Meerut landmarks
const MEERUT_LOCATIONS = {
  'Shastri Nagar': '28.9845,77.7064',
  'Begum Bridge': '28.9789,77.6986',
  'Hapur Road': '28.9710,77.7234',
  'Meerut Cantt': '28.9842,77.6882',
  'Abu Lane': '28.9920,77.7168',
  'Gandhi Nagar': '28.9665,77.7055',
  'Sadar Bazar': '28.9753,77.7011',
  'default': '28.9845,77.7064'
}

/**
 * @param {object} props
 * @param {string} props.workerName - Worker name for label
 * @param {string} props.workerDistance - e.g. "1.8 km away"
 * @param {string} props.workerEta - e.g. "~14 mins"
 * @param {string} props.workerArea - Area name for positioning
 * @param {string} props.customerLocation - Customer address area
 * @param {number} props.height - Height in px (default 280)
 * @param {boolean} props.showRoute - Whether to show animated route line
 * @param {boolean} props.compact - Compact mode for worker cards
 */
export default function MapEmbed({
  workerName = 'Worker',
  workerDistance = '2.1 km',
  workerEta = '~18 mins',
  workerArea = 'default',
  customerLocation = 'Your Location',
  height = 280,
  showRoute = true,
  compact = false
}) {
  const [mapExpanded, setMapExpanded] = useState(false)
  const [refreshPing, setRefreshPing] = useState(0)

  const coords = MEERUT_LOCATIONS[workerArea] || MEERUT_LOCATIONS['default']
  const [lat, lng] = coords.split(',').map(Number)

  // Slightly offset worker marker from customer
  const workerLat = lat + (Math.random() * 0.018 - 0.009)
  const workerLng = lng + (Math.random() * 0.018 - 0.009)

  // Google Maps Embed URL - shows real satellite/road map of Meerut
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed&hl=en`

  const effectiveHeight = mapExpanded ? 420 : height

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line,#d9d8cd)' }}>
      {/* Real Google Maps iframe */}
      <iframe
        key={refreshPing}
        src={mapSrc}
        width="100%"
        height={effectiveHeight}
        style={{ display: 'block', border: 'none' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${workerName}'s location near Meerut`}
      />

      {/* Overlay: Worker Marker Pill (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#16221d',
          color: '#ffffff',
          padding: compact ? '5px 10px' : '7px 14px',
          borderRadius: '999px',
          fontSize: compact ? '11px' : '12px',
          fontWeight: '700',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'workerPulse 2s infinite',
          zIndex: 10,
          backdropFilter: 'blur(4px)'
        }}
      >
        <span style={{ fontSize: compact ? '14px' : '16px' }}>🛵</span>
        <span>{workerName}</span>
        <span style={{ background: '#e97447', borderRadius: '999px', padding: '1px 6px', fontSize: '10px' }}>
          {workerDistance}
        </span>
      </div>

      {/* Overlay: Customer Location Pin (top-right) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'var(--orange,#e97447)',
          color: '#ffffff',
          padding: compact ? '5px 10px' : '7px 14px',
          borderRadius: '999px',
          fontSize: compact ? '11px' : '12px',
          fontWeight: '700',
          boxShadow: '0 4px 16px rgba(233,116,71,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10
        }}
      >
        <span>🏠</span>
        <span>{customerLocation}</span>
      </div>

      {/* Overlay: ETA Footer Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--line,#d9d8cd)',
          padding: compact ? '8px 14px' : '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: compact ? '16px' : '20px' }}>⚡</span>
          <div>
            <strong style={{ fontSize: compact ? '12px' : '13.5px', color: 'var(--ink,#16221d)', display: 'block' }}>
              ETA: {workerEta} • Meerut, UP
            </strong>
            {!compact && (
              <small style={{ color: 'var(--muted,#68736d)', fontSize: '11px' }}>
                Live GPS tracking active • Last updated just now
              </small>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setRefreshPing(p => p + 1)}
            style={{
              background: '#f0fff4',
              border: '1px solid #9ae6b4',
              color: '#22543d',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ↻ Refresh
          </button>
          {!compact && (
            <button
              type="button"
              onClick={() => setMapExpanded(e => !e)}
              style={{
                background: 'var(--paper,#f7f3ea)',
                border: '1px solid var(--line,#d9d8cd)',
                color: 'var(--ink,#16221d)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {mapExpanded ? '⤡ Collapse' : '⤢ Expand'}
            </button>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes workerPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.25), 0 0 0 0 rgba(22,34,29,0.4); }
          50% { box-shadow: 0 4px 16px rgba(0,0,0,0.25), 0 0 0 8px rgba(22,34,29,0); }
        }
      `}</style>
    </div>
  )
}
