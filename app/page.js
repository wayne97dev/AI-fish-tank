'use client'

import { useState, useEffect } from 'react'
import LiveStream from '../components/LiveStream'

// Bubbles Component
function Bubbles() {
  return (
    <div className="bubbles">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bubble"></div>
      ))}
    </div>
  )
}

// Header Component
function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img 
              src="/aquarium-logo.jpg" 
              alt="AI Fish Tank" 
              className="logo-image"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <span className="logo-text">AI Fish Tank</span>
            <span className="ticker">$AQUAI</span>
          </div>
          <nav className="nav-links">
            <a href="https://x.com/ai_tankfish" className="nav-link" target="_blank" rel="noopener noreferrer">
              <span>𝕏</span>
              <span>Twitter</span>
            </a>
            <a href="#" className="nav-link" target="_blank" rel="noopener noreferrer">
              <span>📊</span>
              <span>Dexscreener</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Hero Component
function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">
          <span className="dot"></span>
          <span>AI Monitoring Active</span>
        </div>
        <h1>AI Fish Tank</h1>
        <p>Watch Claude AI autonomously care for a living aquarium ecosystem. Real-time decisions, 24/7 monitoring, complete AI control.</p>
        <div className="powered-by">Powered by <span>Claude AI</span> from Anthropic</div>
      </div>
    </section>
  )
}

function CameraCard({ camera, streamUrl }) {
  const [liveTime, setLiveTime] = useState('')
  const [useStream, setUseStream] = useState(false)
  const [mounted, setMounted] = useState(false)
  const hasImage = camera?.image
  
  useEffect(() => {
    setMounted(true)
    setUseStream(!!streamUrl)
    
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [streamUrl])
  
  return (
    <div className="card camera-card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">📷</span>
          Live Aquarium View
        </div>
        <span className="card-badge">{(useStream || hasImage) ? 'LIVE' : 'OFFLINE'}</span>
      </div>
      <div className="camera-view">
        <div className="camera-overlay">
          <span className="live-dot"></span>
          LIVE • {liveTime || '--:--:--'}
        </div>
        {mounted && useStream ? (
          <LiveStream streamUrl={streamUrl} />
        ) : hasImage ? (
          <img 
            src={`data:image/jpeg;base64,${camera.image}`}
            alt="Aquarium camera feed"
            className="camera-image"
          />
        ) : (
          <div className="camera-placeholder">
            <div className="icon">🐠</div>
            <p>Camera feed loading...</p>
          </div>
        )}
      </div>
      {camera?.aiAnalysis && (
        <div className="camera-analysis">
          <div className="analysis-header">
            <span>🤖</span> AI Analysis
          </div>
          <p>{camera.aiAnalysis}</p>
        </div>
      )}
    </div>
  )
}

// Health Score Component
function HealthScoreCard({ health }) {
  const score = health?.score ?? null
  const status = health?.status ?? 'unknown'
  
  const dashOffset = score !== null ? 408 - (408 * score / 100) : 408
  
  const getStatusText = () => {
    switch(status) {
      case 'excellent': return '🌟 Excellent!'
      case 'good': return '✅ Good'
      case 'fair': return '⚠️ Fair'
      case 'poor': return '❌ Poor'
      case 'critical': return '🚨 Critical!'
      default: return 'Waiting for data...'
    }
  }
  
  const getStatusColor = () => {
    switch(status) {
      case 'excellent': 
      case 'good': return 'var(--success)'
      case 'fair': return 'var(--warning)'
      case 'poor':
      case 'critical': return 'var(--danger)'
      default: return 'var(--text-muted)'
    }
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">💚</span>
          Tank Health Score
        </div>
      </div>
      <div className="health-score">
        <div className="score-circle">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#00E676'}} />
                <stop offset="100%" style={{stopColor: '#00BFFF'}} />
              </linearGradient>
            </defs>
            <circle className="score-bg" cx="80" cy="80" r="65" />
            <circle 
              className="score-fill" 
              cx="80" 
              cy="80" 
              r="65" 
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <div className="score-value">
            <div className="score-number">{score !== null ? Math.round(score) : '--'}</div>
            <div className="score-label">Health</div>
          </div>
        </div>
        <div className="score-status" style={{ color: getStatusColor() }}>
          {getStatusText()}
        </div>
      </div>
    </div>
  )
}

// AI Output Component
function AIOutputCard({ ai }) {
  const message = ai?.lastComment ?? 'Connecting to aquarium systems...'
  const isOnline = ai?.timestamp ? (Date.now() - new Date(ai.timestamp).getTime() < 300000) : false
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">🤖</span>
          Claude&apos;s Latest Output
        </div>
      </div>
      <div className="ai-output">
        <div className="ai-header">
          <div className="ai-avatar">🧠</div>
          <div>
            <div className="ai-name">Claude AI</div>
            <div className="ai-status" style={{ color: isOnline ? 'var(--success)' : 'var(--text-muted)' }}>
              {isOnline ? '● Online' : '○ Waiting...'}
            </div>
          </div>
        </div>
        <div className={`ai-message ${!isOnline ? 'typing' : ''}`}>
          {message}
        </div>
      </div>
    </div>
  )
}

// Activity Log Component
function ActivityLogCard({ history }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--'
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getActionIcon = (action) => {
    switch(action) {
      case 'feed': return '🍽️'
      case 'lights_on': return '💡'
      case 'lights_off': return '🌙'
      case 'heater_on': return '🔥'
      case 'heater_off': return '❄️'
      default: return '💬'
    }
  }

  const logs = history || []

  return (
    <div className="card activity-log-card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">📜</span>
          Claude Activity Log
        </div>
        <span className="card-badge">{logs.length} entries</span>
      </div>
      <div className="activity-log">
        {logs.length === 0 ? (
          <div className="activity-empty">
            <span className="icon">🤖</span>
            <p>No activity yet. Waiting for Claude...</p>
          </div>
        ) : (
          <div className="activity-list">
            {logs.map((entry, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getActionIcon(entry.action)}
                </div>
                <div className="activity-content">
                  <div className="activity-message">{entry.message}</div>
                  <div className="activity-time">
                    {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                    {entry.action && (
                      <span className="activity-action">• Action: {entry.action}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Sensors Card Component
function SensorsCard({ sensors }) {
  const formatValue = (value, unit, decimals = 1) => {
    if (value === null || value === undefined) return '--'
    return `${Number(value).toFixed(decimals)}${unit}`
  }
  
  const sensorsList = [
    { 
      icon: '🌡️', 
      value: formatValue(sensors?.temperature, '°C'), 
      label: 'Water Temp', 
      status: sensors?.temperature ? 'optimal' : null 
    },
    { 
      icon: '💧', 
      value: formatValue(sensors?.ph, '', 1), 
      label: 'pH Level', 
      status: sensors?.ph ? 'optimal' : null 
    },
    { 
      icon: '🫧', 
      value: formatValue(sensors?.oxygen, '%', 0), 
      label: 'Oxygen', 
      status: sensors?.oxygen ? 'optimal' : null 
    },
    { 
      icon: '⚗️', 
      value: formatValue(sensors?.ammonia, ' ppm', 2), 
      label: 'Ammonia', 
      status: sensors?.ammonia !== null && sensors?.ammonia !== undefined ? 'optimal' : null 
    },
  ]
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">📊</span>
          Aquarium Parameters
        </div>
        <span className="card-badge">LIVE</span>
      </div>
      <div className="sensors-grid">
        {sensorsList.map((sensor, index) => (
          <div key={index} className="sensor-item">
            <div className="sensor-icon">{sensor.icon}</div>
            <div className="sensor-value">{sensor.value}</div>
            <div className="sensor-label">{sensor.label}</div>
            {sensor.status && (
              <div className={`sensor-status ${sensor.status}`}>
                {sensor.status === 'optimal' ? 'Optimal' : 'Warning'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Device Status Component
function DeviceStatusCard({ devices }) {
  const getDeviceStatus = (device) => {
    if (!devices || !devices[device]) return { status: 'off', active: false }
    const status = devices[device].status || 'off'
    const active = status === 'on' || status === 'idle'
    return { status, active }
  }
  
  const devicesList = [
    { key: 'light', icon: '💡', name: 'LED Light' },
    { key: 'heater', icon: '🔥', name: 'Heater' },
    { key: 'feeder', icon: '🍽️', name: 'Feeder' },
    { key: 'filter', icon: '🌊', name: 'Filter' },
    { key: 'camera', icon: '📷', name: 'Camera' },
    { key: 'airPump', icon: '💨', name: 'Air Pump' },
  ]
  
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">⚡</span>
          Device Status
        </div>
      </div>
      <div className="devices-grid">
        {devicesList.map((device) => {
          const { status, active } = getDeviceStatus(device.key)
          return (
            <div key={device.key} className={`device-item ${active ? 'active' : 'inactive'}`}>
              <div className="device-icon">{device.icon}</div>
              <div className="device-name">{device.name}</div>
              <div className={`device-status ${status === 'on' ? 'on' : 'off'}`}>
                {status.toUpperCase()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Token Metrics Component
function TokenMetricsCard({ token }) {
  const formatNumber = (value) => {
    if (!value) return '--'
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`
    return `$${value}`
  }
  
  const metrics = [
    { value: formatNumber(token?.marketCap), label: 'Market Cap' },
    { value: token?.holders ?? '--', label: 'Holders' },
    { value: formatNumber(token?.athMarketCap), label: 'ATH Market Cap' },
    { value: formatNumber(token?.volume24h), label: '24h Volume' },
  ]
  
  return (
    <div className="card token-card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">📈</span>
          $AQUAI Token Metrics
        </div>
        <span className="card-badge">LIVE</span>
      </div>
      <div className="token-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="token-stat">
            <div className="token-value">{metric.value}</div>
            <div className="token-label">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Section Component
function AboutSection() {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <h2>🧪 About This Experiment</h2>
          <p>
            <strong className="about-highlight">Can AI take care of and sustain living creatures?</strong>
          </p>
          <p>
            This is the question driving the AI Fish Tank experiment. Unlike traditional aquarium automation that relies on timers and preset schedules, <strong className="about-highlight">Claude AI has complete control</strong> over every aspect of the aquarium environment.
          </p>
          <p>
            When lights turn on, when fish are fed, when the heater activates — these decisions are made in real-time by AI, not by a schedule. Claude observes camera feeds, analyzes fish behavior, monitors water parameters, and makes autonomous decisions 24/7.
          </p>
          <p>
            We&apos;re documenting what works, learning from what goes wrong, and sharing everything openly. Watch as AI learns to keep fish alive and thriving.
          </p>

          <div className="cta-buttons">
            <a href="#" className="cta-btn primary">
              <span>🪙</span>
              <span>Buy $AQUAI</span>
            </a>
            <a href="https://x.com/ai_tankfish" className="cta-btn secondary" target="_blank" rel="noopener noreferrer">
              <span>𝕏</span>
              <span>Follow Updates</span>
            </a>
          </div>

          <div className="disclaimer">
            <p>
              ⚠️ <strong>DISCLAIMER:</strong> The AI Fish Tank ($AQUAI) memecoin is a community experiment. 
              Memecoins are high-risk, speculative assets. Only participate if you can afford to lose what you put in. 
              This is an experiment in AI autonomy, not financial advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-links">
          <a href="https://x.com/ai_tankfish" className="footer-link" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="#" className="footer-link">Dexscreener</a>
          <a href="#" className="footer-link">Pump.fun</a>
        </div>
        <p className="footer-copy">
          🐠 AI Fish Tank — Powered by Claude AI — $AQUAI
        </p>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  const [data, setData] = useState({
    sensors: {},
    ai: {},
    devices: {},
    health: {},
    token: {}
  })
  const [camera, setCamera] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch status data
  const fetchData = async () => {
    try {
      const response = await fetch('/api/status')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch camera data
  const fetchCamera = async () => {
    try {
      const response = await fetch('/api/camera')
      const result = await response.json()
      
      if (result.success && result.data) {
        setCamera(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch camera:', error)
    }
  }

  // Initial fetch and polling
  useEffect(() => {
    fetchData()
    fetchCamera()
    
    // Poll status every 10 seconds
    const statusInterval = setInterval(fetchData, 10000)
    
    // Poll camera every 10 seconds
    const cameraInterval = setInterval(fetchCamera, 10000)
    
    return () => {
      clearInterval(statusInterval)
      clearInterval(cameraInterval)
    }
  }, [])

  return (
    <>
      {/* Background */}
      <div className="bg-ocean"></div>
      
      {/* Bubbles */}
      <Bubbles />

      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Main Content */}
      <main className="container">
        <div className="main-grid">
          <CameraCard camera={camera} streamUrl="https://asylum-mark-lang-dual.trycloudflare.com/fishtank/index.m3u8" />
          <HealthScoreCard health={data.health} />
          <AIOutputCard ai={data.ai} />
          <SensorsCard sensors={data.sensors} />
          <DeviceStatusCard devices={data.devices} />
          <TokenMetricsCard token={data.token} />
        </div>
        
        {/* Activity Log - Full Width */}
        <div className="activity-section">
          <ActivityLogCard history={data.ai?.history} />
        </div>
      </main>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </>
  )
}