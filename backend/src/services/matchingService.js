// src/services/matchingService.js
const firebaseService = require('./firebaseService')
const { calculateDistance } = require('../utils/helpers')

const matchingService = {
  /**
   * Find nearest available verified workers for a service request
   */
  async findNearbyWorkers({ service, customerLat, customerLon, radiusKm = 15, limit = 5 }) {
    // 1. Fetch available workers matching trade category
    const workers = await firebaseService.queryCollection('workers', {
      availability: 'available'
    }, 50)

    // Filter by trade skill
    const matchingTrade = workers.filter((w) => {
      if (!service) return true
      const workerTrade = (w.trade || '').toLowerCase()
      const searchTrade = service.toLowerCase()
      return workerTrade.includes(searchTrade) || searchTrade.includes(workerTrade)
    })

    // 2. Calculate distance if coordinates provided
    if (customerLat && customerLon) {
      const withDistance = matchingTrade.map((w) => {
        const dist = calculateDistance(customerLat, customerLon, w.lat || 28.9845, w.lon || 77.7064)
        return { ...w, distanceKm: dist }
      })

      // Sort by proximity and filter radius
      return withDistance
        .filter((w) => w.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit)
    }

    return matchingTrade.slice(0, limit)
  }
}

module.exports = matchingService
