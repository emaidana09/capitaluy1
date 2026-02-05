import { NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/firebase"
import { ref, set, get } from "firebase/database"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contact_message_title, contact_message_body } = body
    if (!contact_message_title || !contact_message_body) {
      return NextResponse.json({ success: false, error: "Campos requeridos" }, { status: 400 })
    }
    await set(ref(database, "contact_message"), { contact_message_title, contact_message_body })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const snapshot = await get(ref(database, "contact_message"))
    const data = snapshot.exists() ? snapshot.val() : { contact_message_title: "", contact_message_body: "" }
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ contact_message_title: "", contact_message_body: "" })
  }
}
