'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export default function LiveStream({ streamUrl }) {
  const videoRef = useRef(null)
  const [error, setError] = useState(false)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const video = videoRef.current
    if (!video || !streamUrl) return

    console.log('Loading stream:', streamUrl)

    if (Hls.isSupported()) {
      console.log('HLS.js is supported')
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        debug: true,
      })
      
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest parsed, starting playback')
        setStatus('playing')
        video.play()
      })
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data.type, data.details, data)
        if (data.fatal) {
          console.error('Fatal error, type:', data.type)
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.log('Network error, trying to recover...')
            hls.startLoad()
          } else {
            setError(true)
          }
        }
      })

      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Using native HLS')
      video.src = streamUrl
      video.play()
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
