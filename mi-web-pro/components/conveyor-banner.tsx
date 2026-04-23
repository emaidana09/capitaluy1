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

  // Static conveyor for footer: single gray line, not animated
  if (!show) return null

  const text = "Capital UY es una plataforma controlada y gestionada integramente por Fitz & Roy SAS"

  return (
    <div className="conveyor-banner">
      <div className="conveyor-inner">
        <div className="conveyor-box">
          <div className="conveyor-frame" aria-hidden>
            <div className="conveyor-static">
              <span className="conveyor-static-text">{text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
