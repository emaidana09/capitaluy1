"use client"

import { useEffect, useState, type FormEvent } from "react"
import { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import type { AboutContent } from "@/app/api/about/route"

export default function AdminAboutPanel() {
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [referencesText, setReferencesText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/about", { cache: "no-store" })
      const data = await res.json()
      setAbout(data)
    } catch {
      setAbout(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  useEffect(() => {
    if (!about) return
    setReferencesText((about.references ?? []).map((r) => `${r.name}|${r.description}`).join("\n"))
  }, [about])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!about) return

    setIsSaving(true)
    setStatus(null)

    try {
      const references = referencesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, description] = line.split("|").map((s) => s.trim())
          return { name: name || "", description: description || "" }
        })
        .filter((item) => item.name.length > 0 && item.description.length > 0)

      const payload: AboutContent = {
        ...about,
        references,
      }

      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        await mutate("/api/about")
        setStatus({ type: "success", message: "Contenido guardado" })
      } else {
        setStatus({ type: "error", message: data.error || "Error" })
      }
    } catch {
      setStatus({ type: "error", message: "Error de conexión" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setStatus(null), 3000)
    }
  }

  if (isLoading || !about) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Contenido Sobre Nosotros</CardTitle>
        <CardDescription>
          Edita el contenido de Nosotros y la sección Nuestro Compromiso de la página principal
        </CardDescription>
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
            <Label>Título principal</Label>
            <Input
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              placeholder="Sobre Nosotros"
            />
          </div>

          <div>
            <Label>Introducción</Label>
            <Input
              value={about.intro}
              onChange={(e) => setAbout({ ...about, intro: e.target.value })}
              placeholder="Somos tu plataforma..."
            />
          </div>

          <div>
            <Label>Título sección Historia</Label>
            <Input
              value={about.historyTitle}
              onChange={(e) => setAbout({ ...about, historyTitle: e.target.value })}
            />
          </div>

          <div>
            <Label>Texto Historia</Label>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-input"
              value={about.historyText}
              onChange={(e) => setAbout({ ...about, historyText: e.target.value })}
            />
          </div>

          <div>
            <Label>Título sección Compromiso</Label>
            <Input
              value={about.commitmentTitle}
              onChange={(e) => setAbout({ ...about, commitmentTitle: e.target.value })}
            />
          </div>

          <div>
            <Label>Texto Compromiso (página Nosotros)</Label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-input"
              value={about.commitmentText}
              onChange={(e) => setAbout({ ...about, commitmentText: e.target.value })}
            />
          </div>

          <div>
            <Label>Texto Compromiso (página principal)</Label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-input"
              value={about.commitmentHomeText ?? ""}
              onChange={(e) => setAbout({ ...about, commitmentHomeText: e.target.value })}
              placeholder="Con más de 463 operaciones completadas..."
            />
          </div>

          <div>
            <Label>Estadísticas (4 items: valor|etiqueta, uno por línea)</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-input font-mono text-sm"
              value={(about.stats ?? []).map((s) => `${s.value}|${s.label}`).join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter(Boolean)
                const stats = lines.slice(0, 4).map((line) => {
                  const [value, label] = line.split("|").map((s) => s.trim())
                  return { value: value || "", label: label || "" }
                })
                setAbout({ ...about, stats })
              }}
              placeholder="463+|Operaciones en 30 días"
            />
          </div>

          <div>
            <Label>Características (título|descripción, una por línea)</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-input font-mono text-sm"
              value={(about.features ?? []).map((f) => `${f.title}|${f.description}`).join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter(Boolean)
                const features = lines.map((line) => {
                  const [title, description] = line.split("|").map((s) => s.trim())
                  return { title: title || "", description: description || "" }
                })
                setAbout({ ...about, features })
              }}
              placeholder="100% Seguro|Transacciones protegidas"
            />
          </div>

          <div>
            <Label>Título sección Referencias</Label>
            <Input
              value={about.referencesTitle ?? "Referencias"}
              onChange={(e) => setAbout({ ...about, referencesTitle: e.target.value })}
              placeholder="Referencias"
            />
          </div>

          <div>
            <Label>Texto de etiqueta en tarjetas de referencias</Label>
            <Input
              value={about.referenceBadgeText ?? "Cliente verificado"}
              onChange={(e) => setAbout({ ...about, referenceBadgeText: e.target.value })}
              placeholder="Cliente verificado"
            />
          </div>

          <div>
            <Label>Referencias (nombre|descripción, una por línea)</Label>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-input font-mono text-sm"
              value={referencesText}
              onChange={(e) => setReferencesText(e.target.value)}
              placeholder="Juan Pérez|Excelente servicio y atención"
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar contenido
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
