import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { database } from "@/lib/firebase"
import { ref, get, push, set, update, remove } from "firebase/database"

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
    description:
      "Aprende los conceptos basicos del mundo cripto: que es Bitcoin, blockchain, wallets y como empezar de forma segura.",
    level: "Principiante",
    levelColor: "bg-accent text-accent-foreground",
    duration: "4 horas",
    students: 150,
    rating: 4.9,
    price: 2500,
    currency: "UYU",
    features: [
      "Que es Bitcoin y las criptomonedas",
      "Como funciona la blockchain",
      "Crear tu primera wallet",
      "Seguridad basica",
    ],
  },
  {
    id: "2",
    title: "Trading de Criptomonedas",
    description:
      "Domina las tecnicas de trading: analisis tecnico, gestion de riesgo y estrategias para operar en los mercados.",
    level: "Intermedio",
    levelColor: "bg-chart-3 text-background",
    duration: "8 horas",
    students: 89,
    rating: 4.8,
    price: 4500,
    currency: "UYU",
    features: [
      "Analisis tecnico avanzado",
      "Indicadores y patrones",
      "Gestion de riesgo",
      "Estrategias de trading",
    ],
  },
  {
    id: "3",
    title: "DeFi y Finanzas Descentralizadas",
    description:
      "Explora el mundo de las finanzas descentralizadas: protocolos DeFi, yield farming, staking y mas.",
    level: "Avanzado",
    levelColor: "bg-primary text-primary-foreground",
    duration: "6 horas",
    students: 45,
    rating: 4.9,
    price: 5500,
    currency: "UYU",
    features: [
      "Protocolos DeFi principales",
      "Yield farming y staking",
      "Liquidity pools",
      "Riesgos y seguridad",
    ],
  },
]

const COURSES_PATH = 'courses'

let _seeded = false
async function seedDefaultsIfEmpty() {
  if (_seeded) return
  const snap = await get(ref(database, COURSES_PATH))
  if (!snap.exists()) {
    const updates: Record<string, any> = {}
    for (const c of DEFAULT_COURSES) {
      const newKey = push(ref(database, COURSES_PATH)).key as string
      updates[`${COURSES_PATH}/${newKey}`] = { ...c, id: newKey }
    }
    if (Object.keys(updates).length > 0) await update(ref(database), updates)
  }
  _seeded = true
}

export async function GET() {
  try {
    await seedDefaultsIfEmpty()
    const snap = await get(ref(database, COURSES_PATH))
    const courses: Course[] = []
    if (snap.exists()) {
      const val = snap.val()
      for (const k of Object.keys(val)) {
        courses.push({ ...(val[k] as any), id: k })
      }
      courses.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
    }
    return NextResponse.json({ courses })
  } catch (e) {
    return NextResponse.json({ error: "Error leyendo cursos" }, { status: 500 })
  }
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
        const newRef = push(ref(database, COURSES_PATH))
        const newId = newRef.key as string
        const payload = {
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
          id: newId,
        }
        await set(newRef, payload)
        const snap = await get(ref(database, COURSES_PATH))
        const courses: Course[] = []
        if (snap.exists()) {
          const val = snap.val()
          for (const k of Object.keys(val)) courses.push({ ...(val[k] as any), id: k })
          courses.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
        }
        return NextResponse.json({ success: true, courses, course: payload })
      }
      case "update": {
        if (!course.id) return NextResponse.json({ error: "Falta id" }, { status: 400 })
        const node = ref(database, `${COURSES_PATH}/${course.id}`)
        const cur = await get(node)
        if (!cur.exists()) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 })
        await update(node, { ...course })
        const snap = await get(ref(database, COURSES_PATH))
        const courses: Course[] = []
        if (snap.exists()) {
          const val = snap.val()
          for (const k of Object.keys(val)) courses.push({ ...(val[k] as any), id: k })
          courses.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
        }
        return NextResponse.json({ success: true, courses })
      }
      case "delete": {
        if (!course.id) return NextResponse.json({ error: "Falta id" }, { status: 400 })
        const node = ref(database, `${COURSES_PATH}/${course.id}`)
        await remove(node)
        const snap = await get(ref(database, COURSES_PATH))
        const courses: Course[] = []
        if (snap.exists()) {
          const val = snap.val()
          for (const k of Object.keys(val)) courses.push({ ...(val[k] as any), id: k })
          courses.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
        }
        return NextResponse.json({ success: true, courses })
      }
      default:
        return NextResponse.json({ error: "Accion no valida" }, { status: 400 })
    }
  } catch (err) {
    return NextResponse.json({ error: "Error al procesar", details: String(err) }, { status: 500 })
  }
}
