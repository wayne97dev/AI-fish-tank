'use client'

import { useState, useEffect } from 'react'

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
            <div className="logo-icon">🐠</div>
            <span className="logo-text">AI Fish Tank</span>
            <span className="ticker">$AQUAI</span>
          </div>
          <nav className="nav-links">
            <a href="#" className="nav-link" target="_blank" rel="noopener noreferrer">
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

// Camera Card Component
function CameraCard() {
  return (
    <div className="card camera-card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon">📷</span>
          Live Aquarium View
        </div>
        <span className="card-badge">STREAMING</span>
      </div>
      <div className="camera-view">
        <div className="camera-overlay">
          <span className="live-dot"></span>
          LIVE
        </div>
        <div className="camera-placeholder">
          <div className="icon">🐠</div>
          <p>Camera feed coming soon...</p>
        </div>
      </div>
    </div>
  )
}

// Health Score Component
function HealthScoreCard({ health }) {
  const score = health?.score ?? '--'
  const status = health?.status ?? 'Waiting for data...'
  
  // Calculate stroke offset for circle (408 is circumference)
  const strokeOffset = score !== '--' ? 408 - (408 * score / 100) : 408
  
  const statusColors = {
    'excellent': '#00E676',
    'good': '#00E676',
    'fair': '#FFB300',
    'poor': '#FF5252',
    'critical': '#FF5252',
    'unknown': '#8ba3c7'
  }
  
  const statusColor = statusColors[status] || statusColors['unknown']
  
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
              style={{ strokeDashoffset: strokeOffset }}
            />
          </svg>
          <div className="score-value">
            <div className="score-number">{score}</div>
            <div className="score-label">Health</div>
          </div>
        </div>
        <div className="score-status" style={{ color: statusColor }}>
          {status === 'unknown' ? 'Waiting for data...' : status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
    </div>
  )
}

// AI Output Component
function AIOutputCard({ ai }) {
  const message = ai?.lastMessage ?? 'Connecting to aquarium systems...'
  const isOnline = ai?.isOnline ?? false
  
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
            <div className="ai-status" style={{ color: isOnline ? '#00E676' : '#8ba3c7' }}>
              ● {isOnline ? 'Online' : 'Offline'}
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

// Sensors Card Component
function SensorsCard({ sensors }) {
  const sensorData = [
    { 
      icon: '🌡️', 
      value: sensors?.temperature !== null ? `${sensors.temperature}°C` : '--°C', 
      label: 'Water Temp', 
      status: sensors?.temperature ? 'optimal' : 'unknown'
    },
    { 
      icon: '💧', 
      value: sensors?.ph !== null ? sensors.ph : '--', 
      label: 'pH Level', 
      status: sensors?.ph ? 'optimal' : 'unknown'
    },
    { 
      icon: '🫧', 
      value: sensors?.oxygen !== null ? `${sensors.oxygen}%` : '--%', 
      label: 'Oxygen', 
      status: sensors?.oxygen ? 'optimal' : 'unknown'
    },
    { 
      icon: '⚗️', 
      value: sensors?.ammonia !== null ? sensors.ammonia : '--', 
      label: 'Ammonia', 
      status: sensors?.ammonia !== null ? (sensors.ammonia < 0.25 ? 'optimal' : 'warning') : 'unknown'
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
        {sensorData.map((sensor, index) => (
          <div key={index} className="sensor-item">
            <div className="sensor-icon">{sensor.icon}</div>
            <div className="sensor-value">{sensor.value}</div>
            <div className="sensor-label">{sensor.label}</div>
            <div className={`sensor-status ${sensor.status}`}>
              {sensor.status === 'optimal' ? 'Optimal' : sensor.status === 'warning' ? 'Warning' : 'No data'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Device Status Component
function DeviceStatusCard({ devices }) {
  const deviceList = [
    { 
      icon: '💡', 
      name: 'LED Light', 
      status: devices?.light?.status || 'off',
      active: devices?.light?.status === 'on'
    },
    { 
      icon: '🔥', 
      name: 'Heater', 
      status: devices?.heater?.status || 'off',
      active: devices?.heater?.status === 'on'
    },
    { 
      icon: '🍽️', 
      name: 'Feeder', 
      status: devices?.feeder?.status || 'idle',
      active: devices?.feeder?.status === 'feeding'
    },
    { 
      icon: '🌊', 
      name: 'Filter', 
      status: devices?.filter?.status || 'on',
      active: devices?.filter?.status === 'on'
    },
    { 
      icon: '📷', 
      name: 'Camera', 
      status: devices?.camera?.status || 'off',
      active: devices?.camera?.status === 'on'
    },
    { 
      icon: '💨', 
      name: 'Air Pump', 
      status: devices?.airPump?.status || 'off',
      active: devices?.airPump?.status === 'on'
    },
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
        {deviceList.map((device, index) => (
          <div key={index} className={`device-item ${device.active ? 'active' : 'inactive'}`}>
            <div className="device-icon">{device.icon}</div>
            <div className="device-name">{device.name}</div>
            <div className={`device-status ${device.active ? 'on' : 'off'}`}>
              {device.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Token Metrics Component
function TokenMetricsCard({ token }) {
  const metrics = [
    { value: token?.marketCap ? `$${token.marketCap}` : '$--', label: 'Market Cap' },
    { value: token?.holders ?? '--', label: 'Holders' },
    { value: token?.athMarketCap ? `$${token.athMarketCap}` : '$--', label: 'ATH Market Cap' },
    { value: token?.volume24h ?? '--', label: '24h Volume' },
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
            <a href="#" className="cta-btn secondary">
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
          <a href="#" className="footer-link">Twitter</a>
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
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from API
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

  // Initial fetch and polling every 10 seconds
  useEffect(() => {
    fetchData()
    
    const interval = setInterval(fetchData, 10000) // Poll every 10 seconds
    
    return () => clearInterval(interval)
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
          <CameraCard />
          <HealthScoreCard health={data?.health} />
          <AIOutputCard ai={data?.ai} />
          <SensorsCard sensors={data?.sensors} />
          <DeviceStatusCard devices={data?.devices} />
          <TokenMetricsCard token={data?.token} />
        </div>
      </main>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </>
  )
}