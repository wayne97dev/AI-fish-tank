// API Route: /api/health
// Calculates and returns tank health score

let healthData = {
  score: null,
  status: 'unknown',
  factors: {},
  lastUpdate: null
}

// Optimal ranges for tropical fish (guppy)
const OPTIMAL_RANGES = {
  temperature: { min: 24, max: 28, ideal: 26 },  // °C
  ph: { min: 6.8, max: 7.8, ideal: 7.2 },
  oxygen: { min: 70, max: 100, ideal: 85 },      // %
  ammonia: { min: 0, max: 0.25, ideal: 0 }       // ppm
}

function calculateScore(sensors) {
  const scores = {}
  let totalScore = 0
  let validFactors = 0
  
  // Temperature score (25% weight)
  if (sensors.temperature !== null) {
    const temp = sensors.temperature
    const { min, max, ideal } = OPTIMAL_RANGES.temperature
    if (temp >= min && temp <= max) {
      scores.temperature = 100 - Math.abs(temp - ideal) * 10
    } else if (temp < min) {
      scores.temperature = Math.max(0, 100 - (min - temp) * 20)
    } else {
      scores.temperature = Math.max(0, 100 - (temp - max) * 20)
    }
    totalScore += scores.temperature * 0.25
    validFactors += 0.25
  }
  
  // pH score (25% weight)
  if (sensors.ph !== null) {
    const ph = sensors.ph
    const { min, max, ideal } = OPTIMAL_RANGES.ph
    if (ph >= min && ph <= max) {
      scores.ph = 100 - Math.abs(ph - ideal) * 20
    } else {
      scores.ph = Math.max(0, 50 - Math.abs(ph - ideal) * 30)
    }
    totalScore += scores.ph * 0.25
    validFactors += 0.25
  }
  
  // Oxygen score (25% weight)
  if (sensors.oxygen !== null) {
    const o2 = sensors.oxygen
    const { min, ideal } = OPTIMAL_RANGES.oxygen
    if (o2 >= min) {
      scores.oxygen = Math.min(100, 60 + o2 * 0.4)
    } else {
      scores.oxygen = Math.max(0, o2)
    }
    totalScore += scores.oxygen * 0.25
    validFactors += 0.25
  }
  
  // Ammonia score (25% weight)
  if (sensors.ammonia !== null) {
    const nh3 = sensors.ammonia
    const { max } = OPTIMAL_RANGES.ammonia
    if (nh3 <= max) {
      scores.ammonia = 100 - nh3 * 200
    } else {
      scores.ammonia = Math.max(0, 50 - nh3 * 100)
    }
    totalScore += scores.ammonia * 0.25
    validFactors += 0.25
  }
  
  // Normalize score based on available factors
  const finalScore = validFactors > 0 ? Math.round(totalScore / validFactors * 100) / 100 : null
  
  return { finalScore, scores }
}

function getStatus(score) {
  if (score === null) return 'unknown'
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'fair'
  if (score >= 40) return 'poor'
  return 'critical'
}

export async function GET() {
  return Response.json({
    success: true,
    data: healthData,
    optimalRanges: OPTIMAL_RANGES,
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
    
    // Calculate health score from sensor data
    const sensors = {
      temperature: body.temperature ?? null,
      ph: body.ph ?? null,
      oxygen: body.oxygen ?? null,
      ammonia: body.ammonia ?? null
    }
    
    const { finalScore, scores } = calculateScore(sensors)
    
    healthData = {
      score: finalScore,
      status: getStatus(finalScore),
      factors: scores,
      sensors: sensors,
      lastUpdate: new Date().toISOString()
    }
    
    console.log('💚 Health score updated:', healthData.score, healthData.status)
    
    return Response.json({
      success: true,
      message: 'Health score calculated',
      data: healthData
    })
    
  } catch (error) {
    console.error('Error calculating health:', error)
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
