"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { useConfig } from "@/lib/config-context"

interface SiteConfig {
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

export default function AdminConfigPanel() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { refreshConfig, updateConfig } = useConfig()

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config")
      const data = await res.json()
      setConfig({ ...defaultConfig, ...data })
    } catch {
      setConfig(defaultConfig)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatus(null)
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: "success", message: "Configuracion guardada correctamente" })
        if (data.config) {
          updateConfig(data.config)
        } else {
          refreshConfig()
        }
      } else {
        setStatus({ type: "error", message: data.error || "Error al guardar" })
      }
    } catch {
      setStatus({ type: "error", message: "Error de conexion" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Configuracion del Sitio</CardTitle>
        <CardDescription>
          Edita el telefono, correo, redes sociales y textos del sitio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Warning if Google Sheets not configured */}
        {!isLoading && JSON.stringify(config) === JSON.stringify(defaultConfig) && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold mb-1">Integracion con Google Sheets no configurada o incorrecta.</p>
              <p className="text-sm mb-2">Los cambios se guardaran solo en esta sesion del navegador y se perderan al reiniciar el servidor.</p>
              <p className="text-sm">Por favor, configura las variables de entorno (`GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`) y comparte la hoja de Google con el email de la cuenta de servicio como editor. Asegurate que la hoja "Config" existe y tiene columnas Q (Key) y R (Value).</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          {status && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                status.type === "success"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp (numero con codigo pais, sin +)</Label>
              <Input
                value={config.whatsapp_number}
                onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                placeholder="59899123456"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefono (como se muestra)</Label>
              <Input
                value={config.phone_display}
                onChange={(e) => setConfig({ ...config, phone_display: e.target.value })}
                placeholder="+598 99 123 456"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Correo electronico</Label>
            <Input
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="info@capitaluy.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Direccion / Ubicacion</Label>
            <Input
              value={config.address}
              onChange={(e) => setConfig({ ...config, address: e.target.value })}
              placeholder="Montevideo, Uruguay"
            />
          </div>

          <div className="space-y-2">
            <Label>Redes sociales</Label>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                value={config.instagram_url}
                onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
              />
              <Input
                value={config.twitter_url}
                onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })}
                placeholder="https://twitter.com/..."
              />
              <Input
                value={config.telegram_url}
                onChange={(e) => setConfig({ ...config, telegram_url: e.target.value })}
                placeholder="https://t.me/..."
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Instagram, Twitter/X, Telegram. Usa # si no tienes el enlace
            </p>
          </div>

          <div className="space-y-2">
            <Label>Descripcion del footer</Label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-input text-foreground"
              value={config.footer_description}
              onChange={(e) => setConfig({ ...config, footer_description: e.target.value })}
              placeholder="Tu plataforma confiable..."
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar configuracion
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
