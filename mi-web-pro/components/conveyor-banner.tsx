"use client"

import { useEffect, useState } from "react"

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

  if (!show) return null

  return (
    // Usamos las mismas clases que el copyright (text-sm text-muted-foreground)
    // y forzamos la alineación a la izquierda
    <div className="text-sm text-muted-foreground text-left mt-2">
      Capital UY es una plataforma controlada y gestionada por <br />
      Fitz & Roy S.A.S
    </div>
  )
}