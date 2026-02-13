import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { database } from "@/lib/firebase"
import { ref, get, set } from "firebase/database"

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

export interface AboutContent {
  title: string
  intro: string
  historyTitle: string
  historyText: string
  commitmentTitle: string
  commitmentText: string
  commitmentHomeText: string
  stats: { value: string; label: string }[]
  features: { title: string; description: string }[]
  references?: { name: string; description: string }[]
}

const DEFAULT_ABOUT: AboutContent = {
  title: "Sobre Nosotros",
  intro: "Somos tu plataforma de confianza para comprar y vender USDT en Uruguay.",
  historyTitle: "Nuestra Historia",
  historyText: "CapitalUY nacio con la mision de simplificar el acceso a las criptomonedas en Uruguay. Identificamos la necesidad de una plataforma confiable donde las personas pudieran comprar y vender USDT de forma rapida, segura y con asesoramiento personalizado.\n\nHoy nos enorgullece haber completado mas de 463 operaciones en los ultimos 30 dias, con una tasa de exito del 97.27% y un tiempo promedio de liberacion de solo 3.12 minutos. Cada transaccion refuerza nuestro compromiso con la transparencia y la mejor experiencia del usuario.",
  commitmentTitle: "Nuestro Compromiso",
  commitmentText: "Nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT. Atencion personalizada por WhatsApp, precios competitivos y un proceso simple y directo sin complicaciones. Tu seguridad y satisfaccion son nuestra prioridad.",
  commitmentHomeText: "Con mas de 463 operaciones completadas en los ultimos 30 dias y un 97.27% de tasa de exito, nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT. Nuestro tiempo promedio de pago es de solo 3.12 minutos.",
  stats: [
    { value: "463+", label: "Operaciones en 30 dias" },
    { value: "97.27%", label: "Tasa de Completadas" },
    { value: "3.78 min", label: "Tiempo Promedio Liberacion" },
    { value: "100%", label: "Feedback Positivo (102)" },
  ],
  features: [
    { title: "100% Seguro", description: "Transacciones protegidas y verificadas" },
    { title: "Rapido", description: "Tiempo promedio de pago: 3.12 minutos" },
    { title: "Soporte Personalizado", description: "Atencion directa por WhatsApp" },
    { title: "Sin complicaciones", description: "Proceso simple y directo" },
  ],
  references: [
    { name: "Juan Perez", description: "Excelente servicio y atención" },
    { name: "Maria Gomez", description: "Rápido y seguro, muy recomendable" },
    { name: "Carlos Ruiz", description: "Siempre cumplen, muy confiable" },
  ],
}

const ABOUT_DB_KEY = "aboutContent"

async function readStoredAbout(): Promise<Partial<AboutContent> | null> {
  try {
    const snapshot = await get(ref(database, ABOUT_DB_KEY))
    return snapshot.exists() ? (snapshot.val() as Partial<AboutContent>) : null
  } catch {
    return null
  }
}

async function writeStoredAbout(data: AboutContent) {
  await set(ref(database, ABOUT_DB_KEY), data)
}

export async function GET() {
  try {
    const stored = await readStoredAbout()
    const merged = { ...DEFAULT_ABOUT, ...(stored ?? {}) }
    return NextResponse.json(merged)
  } catch {
    return NextResponse.json(DEFAULT_ABOUT)
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const stored = await readStoredAbout()
    const newAbout: AboutContent = { ...DEFAULT_ABOUT, ...(stored ?? {}), ...body }
    await writeStoredAbout(newAbout)
    return NextResponse.json({ success: true, about: newAbout })
  } catch (err) {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
