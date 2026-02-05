"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"

export default function AdminContactMessagePanel() {
  const [message, setMessage] = useState({
    contact_message_title: "",
    contact_message_body: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetch("/api/contact-message")
      .then(res => res.json())
      .then(data => {
        setMessage(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatus(null)
    try {
      const res = await fetch("/api/contact-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: "success", message: "Mensaje guardado correctamente" })
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
        <CardTitle>Mensaje de Contacto</CardTitle>
        <CardDescription>Edita el mensaje que aparece en la página de contacto</CardDescription>
      </CardHeader>
      <CardContent>
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
          <div>
            <Label htmlFor="contact_message_title">Título</Label>
            <Input
              id="contact_message_title"
              value={message.contact_message_title}
              onChange={e => setMessage({ ...message, contact_message_title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contact_message_body">Mensaje</Label>
            <Input
              id="contact_message_body"
              value={message.contact_message_body}
              onChange={e => setMessage({ ...message, contact_message_body: e.target.value })}
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" /> Guardar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
