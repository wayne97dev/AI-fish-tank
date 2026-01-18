'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export default function LiveStream({ streamUrl }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data)
        if (data.fatal) setError(true)
      })

      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl
    }
  }, [streamUrl])

  if (error) {
    return (
      <div className="camera-placeholder">
        <div className="icon">📹</div>
        <p>Stream offline</p>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="camera-image"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
