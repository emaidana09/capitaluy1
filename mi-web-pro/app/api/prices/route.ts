import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { database } from '@/lib/firebase'
import type { CryptoPrice } from '@/lib/types'
import { ref, get, set, update, remove } from 'firebase/database'

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

async function readAllPrices(): Promise<CryptoPrice[]> {
  try {
    const snap = await get(ref(database, 'prices'))
    if (!snap.exists()) return []
    const val = snap.val()
    const arr: CryptoPrice[] = Object.keys(val).map((k) => ({ ...(val[k] as any), id: k }))
    arr.sort((a, b) => (String(a.symbol || '').localeCompare(String(b.symbol || ''))))
    return arr
  } catch (e) {
    return []
  }
}

export async function GET() {
  try {
    const cryptos = await readAllPrices()
    return NextResponse.json({ cryptos, lastUpdated: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ cryptos: [], lastUpdated: new Date().toISOString() })
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesion como administrador." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "update": {
        const { id, buyPrice, sellPrice } = data
        const node = ref(database, `prices/${id}`)
        const cur = await get(node)
        if (!cur.exists()) return NextResponse.json({ error: 'Crypto not found' }, { status: 404 })
        await update(node, { buyPrice, sellPrice, lastUpdated: new Date().toISOString() })
        break
      }

      case "add": {
        const { symbol, name, buyPrice, sellPrice } = data
        const newId = symbol.toLowerCase()
        const node = ref(database, `prices/${newId}`)
        const exists = await get(node)
        if (exists.exists()) return NextResponse.json({ error: 'Crypto already exists' }, { status: 400 })
        await set(node, {
          id: newId,
          symbol: symbol.toUpperCase(),
          name,
          buyPrice,
          sellPrice,
          enabled: true,
          lastUpdated: new Date().toISOString(),
        })
        break
      }

      case "delete": {
        const { id } = data
        await remove(ref(database, `prices/${id}`))
        break
      }

      case "toggle": {
        const { id } = data
        const node = ref(database, `prices/${id}`)
        const cur = await get(node)
        if (cur.exists()) {
          const current = cur.val() as any
          await update(node, { enabled: !current.enabled })
        }
        break
      }

      case "import": {
        const { csvData } = data
        const lines = csvData.trim().split('\n')
        const updates: Record<string, any> = {}
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c: string) => c.trim())
          if (cols.length >= 4) {
            const id = cols[0].toLowerCase()
            updates[`/prices/${id}`] = {
              id,
              symbol: cols[0].toUpperCase(),
              name: cols[1],
              buyPrice: Number.parseFloat(cols[2]) || 0,
              sellPrice: Number.parseFloat(cols[3]) || 0,
              enabled: cols[4] !== 'false',
              lastUpdated: new Date().toISOString(),
            }
          }
        }
        if (Object.keys(updates).length > 0) await update(ref(database), updates)
        break
      }

      case "bulk_update": {
        const { prices } = data
        const updates: Record<string, any> = {}
        for (const price of prices) {
          updates[`/prices/${price.id}`] = { buyPrice: price.buyPrice, sellPrice: price.sellPrice, lastUpdated: new Date().toISOString() }
        }
        if (Object.keys(updates).length > 0) await update(ref(database), updates)
        break
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    const cryptos = await readAllPrices()
    return NextResponse.json({ cryptos, lastUpdated: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
