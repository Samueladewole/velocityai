/**
 * ERIP Platform API Server
 * 
 * Express server for handling all API routes and services
 */

import express from 'express'
import cors from 'cors'
import { createTrustScoreRouter } from '../services/api/trustScoreApi'
import { createPrismRouter } from '../services/api/prismApi'
import { healthCheckRouter } from '../infrastructure/health/healthCheck'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check endpoint
app.use('/health', healthCheckRouter)

// API Routes
app.use('/api/trust-score', createTrustScoreRouter())
app.use('/api/prism', createPrismRouter())

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 ERIP API Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔒 Trust Score API: http://localhost:${PORT}/api/trust-score`)
  console.log(`📈 PRISM API: http://localhost:${PORT}/api/prism`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app