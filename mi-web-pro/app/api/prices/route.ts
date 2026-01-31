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

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  buyPrice: number
  sellPrice: number
  enabled: boolean
  lastUpdated: string
}

// In-memory storage for crypto prices (in production, use a database)
let cryptoPrices: CryptoPrice[] = [
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    buyPrice: 43.50,
    sellPrice: 42.80,
    enabled: true,
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json({
    cryptos: cryptoPrices,
    lastUpdated: new Date().toISOString(),
  })
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
        // Update a single crypto price
        const { id, buyPrice, sellPrice } = data
        const index = cryptoPrices.findIndex((c) => c.id === id)
        if (index === -1) {
          return NextResponse.json(
            { error: "Crypto not found" },
            { status: 404 }
          )
        }
        cryptoPrices[index] = {
          ...cryptoPrices[index],
          buyPrice,
          sellPrice,
          lastUpdated: new Date().toISOString(),
        }
        break
      }

      case "add": {
        // Add a new crypto
        const { symbol, name, buyPrice, sellPrice } = data
        const newId = symbol.toLowerCase()
        if (cryptoPrices.some((c) => c.id === newId)) {
          return NextResponse.json(
            { error: "Crypto already exists" },
            { status: 400 }
          )
        }
        cryptoPrices.push({
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
        // Delete a crypto
        const { id } = data
        cryptoPrices = cryptoPrices.filter((c) => c.id !== id)
        break
      }

      case "toggle": {
        // Toggle enabled status
        const { id } = data
        const index = cryptoPrices.findIndex((c) => c.id === id)
        if (index !== -1) {
          cryptoPrices[index].enabled = !cryptoPrices[index].enabled
        }
        break
      }

      case "import": {
        // Import from CSV data
        const { csvData } = data
        const lines = csvData.trim().split("\n")
        const newPrices: CryptoPrice[] = []

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c: string) => c.trim())
          if (cols.length >= 4) {
            newPrices.push({
              id: cols[0].toLowerCase(),
              symbol: cols[0].toUpperCase(),
              name: cols[1],
              buyPrice: Number.parseFloat(cols[2]) || 0,
              sellPrice: Number.parseFloat(cols[3]) || 0,
              enabled: cols[4] !== "false",
              lastUpdated: new Date().toISOString(),
            })
          }
        }

        if (newPrices.length > 0) {
          cryptoPrices = newPrices
        }
        break
      }

      case "bulk_update": {
        // Bulk update all prices
        const { prices } = data
        for (const price of prices) {
          const index = cryptoPrices.findIndex((c) => c.id === price.id)
          if (index !== -1) {
            cryptoPrices[index] = {
              ...cryptoPrices[index],
              buyPrice: price.buyPrice,
              sellPrice: price.sellPrice,
              lastUpdated: new Date().toISOString(),
            }
          }
        }
        break
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      cryptos: cryptoPrices,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
