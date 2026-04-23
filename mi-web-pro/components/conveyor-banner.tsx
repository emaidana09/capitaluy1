"use client"

import { useEffect, useState, useRef } from "react"

export default function ConveyorBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const path = window.location.pathname || "/"
    // hide on admin panel
    if (path.startsWith("/admin")) {
      setShow(false)
    } else {
      setShow(true)
    }
  }, [])

  const trackRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!trackRef.current || !frameRef.current) return
    const track = trackRef.current
    // measure single-items width (half of duplicated track)
    const total = track.scrollWidth
    const half = Math.floor(total / 2)
    // set css variable on frame to be used by keyframes calc
    frameRef.current.style.setProperty('--conveyor-half', `${half}px`)
    // keep animation duration proportional to width (approx 90px/sec)
    const duration = Math.max(18, Math.round(half / 90))
    frameRef.current.style.setProperty('--conveyor-duration', `${duration}s`)
    setReady(true)
  }, [show])

  if (!show) return null

  const brand = "capital-uy.com"
  const rest = " es una plataforma controlada y gestionada integramente por Fitz & Roy SAS"
  const count = 6
  const items = Array.from({ length: count }).map((_, i) => (
    <span key={i} className="conveyor-item">
      <span className="conveyor-brand">{brand}</span>
      <span className="conveyor-rest">{rest}</span>
    </span>
  ))


  return (
    <div className="conveyor-banner">
      <div className="conveyor-inner">
        <div className="conveyor-box">
          <div className="conveyor-frame" ref={frameRef} aria-hidden>
            <div
              className="conveyor-track"
              ref={trackRef}
              style={ready ? { animation: `conveyor var(--conveyor-duration) linear infinite` } : {}}
            >
              {items}
              {items}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
