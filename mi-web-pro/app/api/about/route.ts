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

export interface AboutContent {
  title: string
  intro: string
  historyTitle: string
  historyText: string
  commitmentTitle: string
  commitmentText: string
  stats: { value: string; label: string }[]
  features: { title: string; description: string }[]
}

const DEFAULT_ABOUT: AboutContent = {
  title: "Sobre Nosotros",
  intro: "Somos tu plataforma de confianza para comprar y vender USDT en Uruguay.",
  historyTitle: "Nuestra Historia",
  historyText: "CapitalUY nacio con la mision de simplificar el acceso a las criptomonedas en Uruguay. Identificamos la necesidad de una plataforma confiable donde las personas pudieran comprar y vender USDT de forma rapida, segura y con asesoramiento personalizado.\n\nHoy nos enorgullece haber completado mas de 463 operaciones en los ultimos 30 dias, con una tasa de exito del 97.27% y un tiempo promedio de liberacion de solo 3.12 minutos. Cada transaccion refuerza nuestro compromiso con la transparencia y la mejor experiencia del usuario.",
  commitmentTitle: "Nuestro Compromiso",
  commitmentText: "Nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT. Atencion personalizada por WhatsApp, precios competitivos y un proceso simple y directo sin complicaciones. Tu seguridad y satisfaccion son nuestra prioridad.",
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
}

let aboutContent: AboutContent = JSON.parse(JSON.stringify(DEFAULT_ABOUT))

export async function GET() {
  return NextResponse.json(aboutContent)
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    aboutContent = { ...aboutContent, ...body }
    return NextResponse.json({ success: true, about: aboutContent })
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
