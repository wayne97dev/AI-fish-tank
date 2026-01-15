// API Route: /api/status
// Returns all aquarium data in one request (for frontend polling)

import { store, OPTIMAL_RANGES, calculateHealthScore } from '@/app/lib/store'

export async function GET() {
  // Recalculate health score
  const health = calculateHealthScore(store.sensors)
  
  return Response.json({
    success: true,
    data: {
      sensors: store.sensors,
      ai: store.ai,
      devices: store.devices,
      health: {
        ...health,
        lastUpdate: store.health.lastUpdate
      },
      token: store.token
    },
    optimalRanges: OPTIMAL_RANGES,
    timestamp: new Date().toISOString()
  })
}

// POST to update multiple things at once
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (process.env.API_SECRET && apiKey !== process.env.API_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const now = new Date().toISOString()
    
    // Update sensors
    if (body.sensors) {
      store.sensors = {
        ...store.sensors,
        ...body.sensors,
        lastUpdate: now
      }
      
      // Auto-calculate health
      const health = calculateHealthScore(store.sensors)
      store.health = { ...health, lastUpdate: now }
    }
    
    // Update AI
    if (body.ai) {
      const newEntry = {
        message: body.ai.message,
        action: body.ai.action || null,
        timestamp: now
      }
      
      store.ai = {
        lastMessage: body.ai.message || store.ai.lastMessage,
        lastAction: body.ai.action || store.ai.lastAction,
        lastDecision: body.ai.decision || store.ai.lastDecision,
        isOnline: true,
        lastUpdate: now,
        history: [newEntry, ...store.ai.history].slice(0, 50)
      }
    }
    
    // Update devices
    if (body.devices) {
      Object.keys(body.devices).forEach(device => {
        if (store.devices[device]) {
          store.devices[device] = {
            ...store.devices[device],
            status: body.devices[device],
            lastChange: now
          }
        }
      })
      store.devices.lastUpdate = now
    }
    
    console.log('📡 Status updated from Raspberry Pi')
    
    return Response.json({
      success: true,
      message: 'Status updated',
      timestamp: now
    })
    
  } catch (error) {
    console.error('Error updating status:', error)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
