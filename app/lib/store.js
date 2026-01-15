// Shared state store for all API routes
// In production, replace with database (Supabase, PlanetScale, etc.)

export const store = {
  sensors: {
    temperature: null,
    ph: null,
    oxygen: null,
    ammonia: null,
    lastUpdate: null
  },
  
  ai: {
    lastMessage: 'Connecting to aquarium systems...',
    lastAction: null,
    lastDecision: null,
    isOnline: false,
    lastUpdate: null,
    history: []
  },
  
  devices: {
    light: { status: 'off', lastChange: null },
    heater: { status: 'off', lastChange: null },
    feeder: { status: 'idle', lastFed: null, feedCount: 0 },
    filter: { status: 'on', lastChange: null },
    camera: { status: 'off', isStreaming: false },
    airPump: { status: 'off', lastChange: null },
    lastUpdate: null
  },
  
  health: {
    score: null,
    status: 'unknown',
    factors: {},
    lastUpdate: null
  },
  
  token: {
    marketCap: null,
    holders: null,
    athMarketCap: null,
    volume24h: null,
    lastUpdate: null
  }
}

// Optimal ranges for guppy fish
export const OPTIMAL_RANGES = {
  temperature: { min: 24, max: 28, ideal: 26, unit: '°C' },
  ph: { min: 6.8, max: 7.8, ideal: 7.2, unit: '' },
  oxygen: { min: 70, max: 100, ideal: 85, unit: '%' },
  ammonia: { min: 0, max: 0.25, ideal: 0, unit: 'ppm' }
}

// Calculate health score
export function calculateHealthScore(sensors) {
  const scores = {}
  let totalScore = 0
  let validFactors = 0
  
  if (sensors.temperature !== null) {
    const temp = sensors.temperature
    const { min, max, ideal } = OPTIMAL_RANGES.temperature
    if (temp >= min && temp <= max) {
      scores.temperature = Math.round(100 - Math.abs(temp - ideal) * 10)
    } else {
      scores.temperature = Math.max(0, Math.round(50 - Math.abs(temp - ideal) * 10))
    }
    totalScore += scores.temperature * 0.25
    validFactors += 0.25
  }
  
  if (sensors.ph !== null) {
    const ph = sensors.ph
    const { min, max, ideal } = OPTIMAL_RANGES.ph
    if (ph >= min && ph <= max) {
      scores.ph = Math.round(100 - Math.abs(ph - ideal) * 20)
    } else {
      scores.ph = Math.max(0, Math.round(50 - Math.abs(ph - ideal) * 30))
    }
    totalScore += scores.ph * 0.25
    validFactors += 0.25
  }
  
  if (sensors.oxygen !== null) {
    scores.oxygen = Math.min(100, Math.round(sensors.oxygen))
    totalScore += scores.oxygen * 0.25
    validFactors += 0.25
  }
  
  if (sensors.ammonia !== null) {
    scores.ammonia = Math.max(0, Math.round(100 - sensors.ammonia * 200))
    totalScore += scores.ammonia * 0.25
    validFactors += 0.25
  }
  
  const finalScore = validFactors > 0 ? Math.round(totalScore / validFactors) : null
  
  let status = 'unknown'
  if (finalScore !== null) {
    if (finalScore >= 90) status = 'excellent'
    else if (finalScore >= 75) status = 'good'
    else if (finalScore >= 60) status = 'fair'
    else if (finalScore >= 40) status = 'poor'
    else status = 'critical'
  }
  
  return { score: finalScore, status, factors: scores }
}
