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

export const DEFAULT_CONFIG: SiteConfig = {
  whatsapp_number: "59899584364",
  email: "info@capitaluy.com",
  phone_display: "+598 99 584 364",
  address: "Montevideo, Uruguay",
  instagram_url: "#",
  twitter_url: "#",
  telegram_url: "#",
  footer_description: "Tu plataforma confiable para comprar y vender USDT y criptomonedas en Uruguay.",
}

type ConfigContextValue = {
  config: SiteConfig
  refreshConfig: () => void
  updateConfig: (newConfig: SiteConfig) => void
}

const ConfigContext = createContext<ConfigContextValue>({ 
  config: DEFAULT_CONFIG, 
  refreshConfig: () => {},
  updateConfig: () => {},
})

function mergeConfig(data: Partial<SiteConfig>): SiteConfig {
  const merged = { ...DEFAULT_CONFIG }
  for (const k of Object.keys(merged) as (keyof SiteConfig)[]) {
    const v = data[k]
    if (v != null && String(v).trim() !== "") merged[k] = String(v).trim()
  }
  return merged
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)

  const refreshConfig = () => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data: Partial<SiteConfig>) => setConfig(mergeConfig(data)))
      .catch(() => {})
  }

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(mergeConfig(newConfig))
  }

  useEffect(() => {
    refreshConfig()
  }, [])

  return <ConfigContext.Provider value={{ config, refreshConfig, updateConfig }}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  return useContext(ConfigContext)
}
