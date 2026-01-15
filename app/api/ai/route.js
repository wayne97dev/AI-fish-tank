// API Route: /api/ai
// Receives Claude AI decisions and outputs

let aiData = {
  lastMessage: 'Connecting to aquarium systems...',
  lastAction: null,
  lastDecision: null,
  isOnline: false,
  lastUpdate: null,
  history: []
}

export async function GET() {
  return Response.json({
    success: true,
    data: aiData,
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
    
    // Update AI data
    const newEntry = {
      message: body.message,
      action: body.action || null,
      decision: body.decision || null,
      timestamp: new Date().toISOString()
    }
    
    aiData = {
      lastMessage: body.message || aiData.lastMessage,
      lastAction: body.action || aiData.lastAction,
      lastDecision: body.decision || aiData.lastDecision,
      isOnline: true,
      lastUpdate: new Date().toISOString(),
      history: [newEntry, ...aiData.history].slice(0, 50) // Keep last 50 entries
    }
    
    console.log('🤖 AI output updated:', newEntry)
    
    return Response.json({
      success: true,
      message: 'AI output updated',
      data: aiData
    })
    
  } catch (error) {
    console.error('Error updating AI:', error)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
