import { google } from "googleapis"

export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1jnNmF47Y-aaMc6xsaRg2fNo31pG_KWpPIN1AVbGQD04"
// Primera hoja para precios (columnas: Symbol, Name, BuyPrice, SellPrice, Enabled)
// Hoja "Config" para: whatsapp_number, email, etc. (columnas Q y R)
const PRICES_RANGE = "A:E"
const CONFIG_RANGE = "Config!Q:R"

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  buyPrice: number
  sellPrice: number
  enabled: boolean
  lastUpdated: string
}

export interface SiteConfig {
  whatsapp_number: string
  email: string
  phone_display: string
  address: string
  instagram_url: string
  twitter_url: string
  telegram_url: string
  footer_description: string
}

const DEFAULT_CONFIG: SiteConfig = {
  whatsapp_number: "59899123456",
  email: "info@capitaluy.com",
  phone_display: "+598 99 123 456",
  address: "Montevideo, Uruguay",
  instagram_url: "#",
  twitter_url: "#",
  telegram_url: "#",
  footer_description: "Tu plataforma confiable para comprar y vender USDT y criptomonedas en Uruguay.",
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) return null

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  return auth
}

export async function getPricesFromSheet(): Promise<CryptoPrice[] | null> {
  try {
    const auth = getAuth()
    if (!auth) return null

    const sheets = google.sheets({ version: "v4", auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: PRICES_RANGE,
    })

    const rows = response.data.values as string[][] | undefined
    if (!rows || rows.length < 2) return null

    const headers = rows[0].map((h) => h?.toString().toLowerCase().trim() || "")
    const priceRows = rows.slice(1)

    const cryptos: CryptoPrice[] = priceRows
      .filter((row) => row && row[0])
      .map((row) => {
        const getCol = (keys: string[]) => {
          const idx = keys.findIndex((k) => headers.includes(k))
          if (idx === -1) return ""
          const key = keys[idx]
          return row[headers.indexOf(key)]?.toString().trim() || ""
        }

        const symbol = getCol(["symbol", "simbolo"]) || row[0]?.toString().trim() || ""
        const name = getCol(["name", "nombre"]) || row[1]?.toString().trim() || symbol
        const buyPrice = Number.parseFloat(getCol(["buyprice", "compra", "buy"])) || 0
        const sellPrice = Number.parseFloat(getCol(["sellprice", "venta", "sell"])) || 0
        const enabled = getCol(["enabled", "activo"]) !== "false" && getCol(["enabled", "activo"]) !== "0"

        return {
          id: symbol.toLowerCase(),
          symbol: symbol.toUpperCase(),
          name,
          buyPrice,
          sellPrice,
          enabled,
          lastUpdated: new Date().toISOString(),
        }
      })

    return cryptos
  } catch {
    return null
  }
}

export async function writePricesToSheet(cryptos: CryptoPrice[]): Promise<boolean> {
  try {
    const auth = getAuth()
    if (!auth) return false

    const sheets = google.sheets({ version: "v4", auth })
    const values = [
      ["Symbol", "Name", "BuyPrice", "SellPrice", "Enabled"],
      ...cryptos.map((c) => [c.symbol, c.name, c.buyPrice, c.sellPrice, c.enabled ? "true" : "false"]),
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
    return true
  } catch {
    return false
  }
}

export async function getConfigFromSheet(): Promise<SiteConfig | null> {
  try {
    const auth = getAuth()
    if (!auth) return null

    const sheets = google.sheets({ version: "v4", auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: CONFIG_RANGE,
    })

    const rows = response.data.values as string[][] | undefined
    if (!rows) return null

    const config = { ...DEFAULT_CONFIG }
    for (const row of rows.slice(1)) {
      if (row[0] && row[1]) {
        const key = row[0].toString().trim() as keyof SiteConfig
        if (key in config) {
          config[key] = row[1].toString().trim()
        }
      }
    }
    return config
  } catch {
    return null
  }
}

export async function writeConfigToSheet(config: SiteConfig): Promise<boolean> {
  try {
    const auth = getAuth()
    if (!auth) return false

    const sheets = google.sheets({ version: "v4", auth })
    const values = [
      ["Key", "Value"],
      ...Object.entries(config).map(([k, v]) => [k, v]),
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Config!Q1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    })
    return true
  } catch {
    return false
  }
}

export { DEFAULT_CONFIG }
