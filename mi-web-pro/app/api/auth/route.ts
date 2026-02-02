import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { database } from "@/lib/firebase"
import { ref, get, set } from "firebase/database"

// Default admin credentials - used only if no admin exists in RTDB
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "rodriguez@capital-uy.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gewNlEVtA5Hcl3V71RvkT"
const SESSION_SECRET = process.env.SESSION_SECRET || "capitaluy-secret-key-2024"

// Simple session token generator
function generateSessionToken(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}-${SESSION_SECRET.substring(0, 8)}`
}

// Validate session token
function isValidToken(token: string): boolean {
  if (!token) return false
  const parts = token.split("-")
  if (parts.length < 3) return false
  
  // Check if token contains our secret marker
  return parts[2] === SESSION_SECRET.substring(0, 8)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, username, password } = body

    if (action === "login") {
      // First try to find admin in RTDB
      let adminExists = false
      let dbAdmin: any = null
      try {
        const snap = await get(ref(database, "admins/default"))
        if (snap.exists()) {
          adminExists = true
          dbAdmin = snap.val()
          if (dbAdmin.username === username && dbAdmin.password === password) {
            const token = generateSessionToken()
            const cookieStore = await cookies()
            cookieStore.set("admin_session", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 60 * 24,
              path: "/",
            })
            return NextResponse.json({ success: true, message: "Login exitoso" })
          }
          return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
        }
      } catch (e) {
        console.error("Error reading admin from RTDB:", e)
      }

      // Fallback to env credentials if no admin in RTDB
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = generateSessionToken()
        const cookieStore = await cookies()
        cookieStore.set("admin_session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        })

        // Auto-save credentials to RTDB on first login
        if (!adminExists) {
          try {
            await set(ref(database, "admins/default"), { username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
          } catch (e) {
            console.error("Error saving admin to RTDB:", e)
          }
        }

        return NextResponse.json({ success: true, message: "Login exitoso" })
      }

      return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
    }

    if (action === "logout") {
      const cookieStore = await cookies()
      cookieStore.delete("admin_session")

      return NextResponse.json({ success: true, message: "Sesion cerrada" })
    }

    // Create or update admin account in RTDB
    if (action === "create") {
      const cookieStore = await cookies()
      const token = cookieStore.get("admin_session")?.value
      const authenticated = token && isValidToken(token)

      // Check if admin already exists
      try {
        const snap = await get(ref(database, "admins/default"))
        // If admin exists and no authentication, deny
        if (snap.exists() && !authenticated) {
          return NextResponse.json({ success: false, error: "No autorizado para crear admin" }, { status: 401 })
        }
      } catch (e) {
        // ignore
      }

      // Create/update admin
      const newAdmin = { username: username || ADMIN_USERNAME, password: password || ADMIN_PASSWORD }
      await set(ref(database, "admins/default"), newAdmin)
      return NextResponse.json({ success: true, message: "Admin creado/actualizado" })
    }

    if (action === "check") {
      const cookieStore = await cookies()
      const token = cookieStore.get("admin_session")?.value

      if (token && isValidToken(token)) {
        return NextResponse.json({ 
          authenticated: true 
        })
      }

      return NextResponse.json({ 
        authenticated: false 
      })
    }

    return NextResponse.json(
      { error: "Accion no valida" },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value

    if (token && isValidToken(token)) {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
