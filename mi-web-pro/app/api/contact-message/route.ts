import { NextRequest, NextResponse } from "next/server"
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contact_message_title, contact_message_body } = body
    if (!contact_message_title || !contact_message_body) {
      return NextResponse.json({ success: false, error: "Campos requeridos" }, { status: 400 })
    }
    if (!FIREBASE_DB_URL) {
      return NextResponse.json({ success: false, error: "FIREBASE_DB_URL no definida" }, { status: 500 })
    }
    await fetch(`${FIREBASE_DB_URL}/contact_message.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_message_title, contact_message_body })
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!FIREBASE_DB_URL) {
      return NextResponse.json({ contact_message_title: "", contact_message_body: "" })
    }
    const res = await fetch(`${FIREBASE_DB_URL}/contact_message.json`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ contact_message_title: "", contact_message_body: "" })
  }
}
