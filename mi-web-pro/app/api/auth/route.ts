import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Default admin credentials - should be changed via environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "capitaluy2024"
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
      // Validate credentials
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = generateSessionToken()
        const cookieStore = await cookies()
        
        // Set HTTP-only cookie with session token
        cookieStore.set("admin_session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        })

        return NextResponse.json({ 
          success: true, 
          message: "Login exitoso" 
        })
      }

      return NextResponse.json(
        { success: false, error: "Credenciales incorrectas" },
        { status: 401 }
      )
    }

    if (action === "logout") {
      const cookieStore = await cookies()
      cookieStore.delete("admin_session")
      
      return NextResponse.json({ 
        success: true, 
        message: "Sesion cerrada" 
      })
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
