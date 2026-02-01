import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getConfigFromSheet, writeConfigToSheet, DEFAULT_CONFIG, type SiteConfig } from "@/lib/google-sheets"

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

// In-memory fallback when no Google Sheets
let memoryConfig: SiteConfig | null = null

export async function GET() {
  try {
    const sheetConfig = await getConfigFromSheet()
    if (sheetConfig) {
      return NextResponse.json(sheetConfig)
    }
    if (memoryConfig) {
      return NextResponse.json(memoryConfig)
    }
    return NextResponse.json(DEFAULT_CONFIG)
  } catch {
    return NextResponse.json(memoryConfig || DEFAULT_CONFIG)
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const config: SiteConfig = {
      whatsapp_number: body.whatsapp_number ?? DEFAULT_CONFIG.whatsapp_number,
      email: body.email ?? DEFAULT_CONFIG.email,
      phone_display: body.phone_display ?? DEFAULT_CONFIG.phone_display,
      address: body.address ?? DEFAULT_CONFIG.address,
      instagram_url: body.instagram_url ?? DEFAULT_CONFIG.instagram_url,
      twitter_url: body.twitter_url ?? DEFAULT_CONFIG.twitter_url,
      telegram_url: body.telegram_url ?? DEFAULT_CONFIG.telegram_url,
      footer_description: body.footer_description ?? DEFAULT_CONFIG.footer_description,
    }

    memoryConfig = config
    const written = await writeConfigToSheet(config)

    return NextResponse.json({
      success: true,
      savedToSheet: written,
      config,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al guardar" },
      { status: 500 }
    )
  }
}
