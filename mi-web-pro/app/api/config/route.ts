import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { database } from '@/lib/firebase'
import { ref, get, update } from 'firebase/database'
import { DEFAULT_CONFIG, type SiteConfig } from '@/lib/config-context'

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

let configCache: SiteConfig | null = null

const configRefPath = 'config/site'

function dbRef(path = '') {
  return path ? ref(database, path) : ref(database)
}

/** Merge config: non-empty values override DEFAULT_CONFIG */
function mergeWithDefaults(source: SiteConfig | null): SiteConfig {
  if (!source) return DEFAULT_CONFIG
  const merged = { ...DEFAULT_CONFIG }
  for (const k of Object.keys(merged) as (keyof SiteConfig)[]) {
    const v = source[k]
    if (v != null && String(v).trim() !== "") {
      merged[k] = String(v).trim()
    }
  }
  return merged
}

export async function GET() {
  try {
    const snap = await get(dbRef(configRefPath))
    const cfg = snap.exists() ? (snap.val() as any) : configCache
    const config = mergeWithDefaults(cfg ?? null)
    configCache = config
    return new NextResponse(JSON.stringify(config), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error in GET /api/config:', error)
    return new NextResponse(JSON.stringify(mergeWithDefaults(configCache)), { headers: { 'Content-Type': 'application/json' } })
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
      whatsapp_number: body.whatsapp_number ? body.whatsapp_number : DEFAULT_CONFIG.whatsapp_number,
      email: body.email ? body.email : DEFAULT_CONFIG.email,
      phone_display: body.phone_display ? body.phone_display : DEFAULT_CONFIG.phone_display,
      address: body.address ? body.address : DEFAULT_CONFIG.address,
      instagram_url: body.instagram_url ? body.instagram_url : DEFAULT_CONFIG.instagram_url,
      twitter_url: body.twitter_url ? body.twitter_url : DEFAULT_CONFIG.twitter_url,
      telegram_url: body.telegram_url ? body.telegram_url : DEFAULT_CONFIG.telegram_url,
      footer_description: body.footer_description ? body.footer_description : DEFAULT_CONFIG.footer_description,
    }

    try {
      await update(dbRef(configRefPath), config)
      configCache = config
      return NextResponse.json({ success: true, config })
    } catch (e) {
      console.error("Error updating config in database:", e)
      configCache = config
      return NextResponse.json({ success: true, config, warning: "Failed to update database, but config updated in memory." })
    }
  } catch (error) {
    console.error("Error in POST /api/config:", error); // Added more specific logging
    return NextResponse.json(
      { error: "Error al guardar" },
      { status: 500 }
    )
  }
}
