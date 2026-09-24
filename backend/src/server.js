// src/server.js
const app = require('./app')
const env = require('./config/env')
const logger = require('./utils/logger')

const PORT = env.PORT || 5000

const server = app.listen(PORT, () => {
  logger.info(`========================================================`)
  logger.info(`🚀 Mazdoor Sytu REST API Server running on port ${PORT}`)
  logger.info(`🌍 Environment: ${env.NODE_ENV}`)
  logger.info(`🔗 Health Check: http://localhost:${PORT}/api/health`)
  logger.info(`📦 API Base URL: http://localhost:${PORT}/api/v1`)
  logger.info(`========================================================`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${PORT} is already in use by another process. Please free port ${PORT} or change PORT in .env`)
  } else {
    logger.error(`❌ Server startup error: ${err.message}`)
  }
  process.exit(1)
})

// Graceful shutdown management
function handleGracefulShutdown(signal) {
  logger.info(`Received ${signal}. Gracefully shutting down Mazdoor Sytu server...`)
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.')
    process.exit(0)
  })

  // Force exit after 10s timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to pending connections timeout.')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'))
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
