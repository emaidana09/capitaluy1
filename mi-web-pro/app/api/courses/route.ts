import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const SESSION_SECRET = process.env.SESSION_SECRET || "capitaluy-secret-key-2024"

function isValidToken(token: string): boolean {
  if (!token) return false
  const parts = token.split("-")
  if (parts.length < 3) return false
  return parts[2] === SESSION_SECRET.substring(0, 8)
}

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  return !!(token && isValidToken(token))
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  levelColor: string
  duration: string
  students: number
  rating: number
  price: number
  currency: string
  features: string[]
}

const DEFAULT_COURSES: Course[] = [
  {
    id: "1",
    title: "Introduccion a las Criptomonedas",
    description: "Aprende los conceptos basicos del mundo cripto: que es Bitcoin, blockchain, wallets y como empezar de forma segura.",
    level: "Principiante",
    levelColor: "bg-accent text-accent-foreground",
    duration: "4 horas",
    students: 150,
    rating: 4.9,
    price: 2500,
    currency: "UYU",
    features: ["Que es Bitcoin y las criptomonedas", "Como funciona la blockchain", "Crear tu primera wallet", "Seguridad basica"],
  },
  {
    id: "2",
    title: "Trading de Criptomonedas",
    description: "Domina las tecnicas de trading: analisis tecnico, gestion de riesgo y estrategias para operar en los mercados.",
    level: "Intermedio",
    levelColor: "bg-chart-3 text-background",
    duration: "8 horas",
    students: 89,
    rating: 4.8,
    price: 4500,
    currency: "UYU",
    features: ["Analisis tecnico avanzado", "Indicadores y patrones", "Gestion de riesgo", "Estrategias de trading"],
  },
  {
    id: "3",
    title: "DeFi y Finanzas Descentralizadas",
    description: "Explora el mundo de las finanzas descentralizadas: protocolos DeFi, yield farming, staking y mas.",
    level: "Avanzado",
    levelColor: "bg-primary text-primary-foreground",
    duration: "6 horas",
    students: 45,
    rating: 4.9,
    price: 5500,
    currency: "UYU",
    features: ["Protocolos DeFi principales", "Yield farming y staking", "Liquidity pools", "Riesgos y seguridad"],
  },
]

let courses: Course[] = JSON.parse(JSON.stringify(DEFAULT_COURSES))

function nextId(): string {
  const ids = courses.map((c) => parseInt(c.id, 10)).filter((n) => !Number.isNaN(n))
  return String(Math.max(0, ...ids) + 1)
}

export async function GET() {
  return NextResponse.json({ courses })
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { action, course } = body

    switch (action) {
      case "add": {
        const newCourse: Course = {
          id: nextId(),
          title: course.title || "Nuevo curso",
          description: course.description || "",
          level: course.level || "Principiante",
          levelColor: course.levelColor || "bg-accent text-accent-foreground",
          duration: course.duration || "4 horas",
          students: course.students ?? 0,
          rating: course.rating ?? 4.5,
          price: course.price ?? 0,
          currency: course.currency || "UYU",
          features: Array.isArray(course.features) ? course.features : [],
        }
        courses.push(newCourse)
        return NextResponse.json({ success: true, courses, course: newCourse })
      }
      case "update": {
        const idx = courses.findIndex((c) => c.id === course.id)
        if (idx === -1) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 })
        courses[idx] = { ...courses[idx], ...course }
        return NextResponse.json({ success: true, courses })
      }
      case "delete": {
        courses = courses.filter((c) => c.id !== course.id)
        return NextResponse.json({ success: true, courses })
      }
      default:
        return NextResponse.json({ error: "Accion no valida" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 })
  }
}
