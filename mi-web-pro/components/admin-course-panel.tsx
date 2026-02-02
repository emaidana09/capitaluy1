"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import type { Course } from "@/app/api/courses/route"

export default function AdminCoursePanel() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses")
      const data = await res.json()
      setCourses(data.courses || [])
    } catch {
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleAdd = async (course: Partial<Course>) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", course }),
      })
      const data = await res.json()
      if (data.success) {
        setCourses(data.courses)
        setShowAddForm(false)
        setStatus({ type: "success", message: "Curso agregado" })
      } else {
        setStatus({ type: "error", message: data.error || "Error" })
      }
    } catch {
      setStatus({ type: "error", message: "Error de conexion" })
    }
    setTimeout(() => setStatus(null), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este curso?")) return
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", course: { id } }),
      })
      const data = await res.json()
      if (data.success) {
        setCourses(data.courses)
        setStatus({ type: "success", message: "Curso eliminado" })
      }
    } catch {
      setStatus({ type: "error", message: "Error" })
    }
    setTimeout(() => setStatus(null), 3000)
  }

  const handleUpdate = async (course: Course) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", course }),
      })
      const data = await res.json()
      if (data.success) {
        setCourses(data.courses)
        setEditing(null)
        setStatus({ type: "success", message: "Curso actualizado" })
      }
    } catch {
      setStatus({ type: "error", message: "Error" })
    }
    setTimeout(() => setStatus(null), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Cursos</CardTitle>
        <CardDescription>
          Agrega, edita o elimina cursos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {!showAddForm ? (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar curso
          </Button>
        ) : (
          <AddCourseForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="space-y-3">
          {courses.map((course) =>
            editing?.id === course.id ? (
              <EditCourseForm
                key={course.id}
                course={course}
                onSave={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20"
              >
                <div>
                  <h4 className="font-semibold">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.level} · ${course.price.toLocaleString("es-UY")} {course.currency}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(course)}>
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AddCourseForm({
  onSave,
  onCancel,
}: {
  onSave: (course: Partial<Course>) => void
  onCancel: () => void
}) {
  const [course, setCourse] = useState<Partial<Course>>({
    title: "",
    description: "",
    level: "Principiante",
    levelColor: "bg-accent text-accent-foreground",
    duration: "4 horas",
    students: 0,
    rating: 4.5,
    price: 0,
    currency: "UYU",
    features: [],
    images: [],
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const toAdd: { name: string; data: string }[] = []
    Array.from(files).forEach((f) => {
      const reader = new FileReader()
      reader.onload = () => {
        const data = String(reader.result || "")
        toAdd.push({ name: f.name, data })
        setCourse((prev) => ({ ...prev, images: [...(prev.images || []), ...toAdd] }))
      }
      reader.readAsDataURL(f)
    })
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(course)
      }}
      className="p-4 rounded-lg border border-border space-y-3"
    >
      <div>
        <Label>Titulo</Label>
        <Input
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          placeholder="Nombre del curso"
        />
      </div>
      <div>
        <Label>Descripcion</Label>
        <textarea
          className="w-full min-h-[60px] px-3 py-2 rounded-md border border-input bg-input"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          placeholder="Descripcion breve"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Nivel</Label>
          <Input
            value={course.level}
            onChange={(e) => setCourse({ ...course, level: e.target.value })}
            placeholder="Principiante"
          />
        </div>
        <div>
          <Label>Duracion</Label>
          <Input
            value={course.duration}
            onChange={(e) => setCourse({ ...course, duration: e.target.value })}
            placeholder="4 horas"
          />
        </div>
        <div>
          <Label>Precio</Label>
          <Input
            type="number"
            value={course.price ?? ""}
            onChange={(e) => setCourse({ ...course, price: Number(e.target.value) || 0 })}
            placeholder="2500"
          />
        </div>
        <div>
          <Label>Caracteristicas (separadas por coma)</Label>
          <Input
            value={course.features?.join(", ")}
            onChange={(e) =>
              setCourse({
                ...course,
                features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
            placeholder="Caracteristica 1, Caracteristica 2"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      <div>
        <Label>Imagenes (arrastra desde una carpeta)</Label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="p-3 border border-dashed rounded-md flex flex-wrap gap-2"
        >
          {(course.images || []).map((img, i) => (
            <div key={i} className="w-20 h-20 overflow-hidden rounded-md border">
              <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-1 border rounded text-sm text-foreground/80"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </form>
  )
}

function EditCourseForm({
  course,
  onSave,
  onCancel,
}: {
  course: Course
  onSave: (course: Course) => void
  onCancel: () => void
}) {
  const [c, setC] = useState<Course>({ ...course })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const toAdd: { name: string; data: string }[] = []
    Array.from(files).forEach((f) => {
      const reader = new FileReader()
      reader.onload = () => {
        const data = String(reader.result || "")
        toAdd.push({ name: f.name, data })
        setC((prev) => ({ ...prev, images: [...(prev.images || []), ...toAdd] }))
      }
      reader.readAsDataURL(f)
    })
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(c)
      }}
      className="p-4 rounded-lg border border-border space-y-3"
    >
      <div>
        <Label>Titulo</Label>
        <Input
          value={c.title}
          onChange={(e) => setC({ ...c, title: e.target.value })}
        />
      </div>
      <div>
        <Label>Descripcion</Label>
        <textarea
          className="w-full min-h-[60px] px-3 py-2 rounded-md border border-input bg-input"
          value={c.description}
          onChange={(e) => setC({ ...c, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Nivel</Label>
          <Input
            value={c.level}
            onChange={(e) => setC({ ...c, level: e.target.value })}
          />
        </div>
        <div>
          <Label>Duracion</Label>
          <Input
            value={c.duration}
            onChange={(e) => setC({ ...c, duration: e.target.value })}
          />
        </div>
        <div>
          <Label>Precio</Label>
          <Input
            type="number"
            value={c.price}
            onChange={(e) => setC({ ...c, price: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Caracteristicas (separadas por coma)</Label>
          <Input
            value={c.features.join(", ")}
            onChange={(e) =>
              setC({
                ...c,
                features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
      <div>
        <Label>Imagenes (arrastra desde una carpeta)</Label>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="p-3 border border-dashed rounded-md flex flex-wrap gap-2"
        >
          {(c.images || []).map((img, i) => (
            <div key={i} className="w-20 h-20 overflow-hidden rounded-md border relative">
              <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setC({ ...c, images: c.images?.filter((_, idx) => idx !== i) || [] })}
                className="absolute top-1 right-1 bg-black/40 text-white rounded px-1 text-xs"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-3 py-1 border rounded text-sm text-foreground/80"
            onClick={() => fileInputRef.current?.click()}
          >
            Seleccionar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>
    </form>
  )
}
