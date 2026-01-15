// API Route: /api/devices
// Tracks smart device status (lights, heater, feeder, etc.)

let devicesData = {
  light: { status: 'off', lastChange: null },
  heater: { status: 'off', lastChange: null },
  feeder: { status: 'idle', lastFed: null, feedCount: 0 },
  filter: { status: 'on', lastChange: null },
  camera: { status: 'off', isStreaming: false },
  airPump: { status: 'off', lastChange: null },
  lastUpdate: null
}

export async function GET() {
  return Response.json({
    success: true,
    data: devicesData,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (process.env.API_SECRET && apiKey !== process.env.API_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const now = new Date().toISOString()
    
    // Update device status
    if (body.light !== undefined) {
      devicesData.light = { status: body.light, lastChange: now }
    }
    if (body.heater !== undefined) {
      devicesData.heater = { status: body.heater, lastChange: now }
    }
    if (body.feeder !== undefined) {
      devicesData.feeder = { 
        status: body.feeder, 
        lastFed: body.feeder === 'feeding' ? now : devicesData.feeder.lastFed,
        feedCount: body.feeder === 'feeding' ? devicesData.feeder.feedCount + 1 : devicesData.feeder.feedCount
      }
    }
    if (body.filter !== undefined) {
      devicesData.filter = { status: body.filter, lastChange: now }
    }
    if (body.camera !== undefined) {
      devicesData.camera = { status: body.camera, isStreaming: body.camera === 'on' }
    }
    if (body.airPump !== undefined) {
      devicesData.airPump = { status: body.airPump, lastChange: now }
    }
    
    devicesData.lastUpdate = now
    
    console.log('⚡ Device status updated:', body)
    
    return Response.json({
      success: true,
      message: 'Device status updated',
      data: devicesData
    })
    
  } catch (error) {
    console.error('Error updating devices:', error)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
