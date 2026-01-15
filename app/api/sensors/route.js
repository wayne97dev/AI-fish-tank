// API Route: /api/sensors
// Receives sensor data from Raspberry Pi

let sensorData = {
  temperature: null,
  ph: null,
  oxygen: null,
  ammonia: null,
  lastUpdate: null
}

export async function GET() {
  return Response.json({
    success: true,
    data: sensorData,
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate API key (optional security)
    const apiKey = request.headers.get('x-api-key')
    if (process.env.API_SECRET && apiKey !== process.env.API_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Update sensor data
    sensorData = {
      temperature: body.temperature ?? sensorData.temperature,
      ph: body.ph ?? sensorData.ph,
      oxygen: body.oxygen ?? sensorData.oxygen,
      ammonia: body.ammonia ?? sensorData.ammonia,
      lastUpdate: new Date().toISOString()
    }
    
    console.log('📊 Sensor data updated:', sensorData)
    
    return Response.json({
      success: true,
      message: 'Sensor data updated',
      data: sensorData
    })
    
  } catch (error) {
    console.error('Error updating sensors:', error)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
