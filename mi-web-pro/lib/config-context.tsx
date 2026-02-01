"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface SiteConfig {
  whatsapp_number: string
  email: string
  phone_display: string
  address: string
  instagram_url: string
  twitter_url: string
  telegram_url: string
  footer_description: string
}

const defaultConfig: SiteConfig = {
  whatsapp_number: "59899123456",
  email: "info@capitaluy.com",
  phone_display: "+598 99 123 456",
  address: "Montevideo, Uruguay",
  instagram_url: "#",
  twitter_url: "#",
  telegram_url: "#",
  footer_description: "Tu plataforma confiable para comprar y vender USDT y criptomonedas en Uruguay.",
}

const ConfigContext = createContext<SiteConfig>(defaultConfig)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setConfig({ ...defaultConfig, ...data }))
      .catch(() => {})
  }, [])

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  return useContext(ConfigContext)
}
