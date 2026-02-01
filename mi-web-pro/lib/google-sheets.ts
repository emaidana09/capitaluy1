import { google } from "googleapis"

export const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1jnNmF47Y-aaMc6xsaRg2fNo31pG_KWpPIN1AVbGQD04"
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`
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

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!clientEmail || !privateKey) {
    console.warn("Google Sheets API: Faltan GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY.")
    return null
  }

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
  } catch (error) {
    console.error("Error al obtener precios de Google Sheet:", error)
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
  } catch (error) {
    console.error("Error al escribir precios en Google Sheet:", error)
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

    // Usar el DEFAULT_CONFIG del frontend como base
    const config: SiteConfig = { 
      whatsapp_number: "", 
      email: "", 
      phone_display: "", 
      address: "", 
      instagram_url: "", 
      twitter_url: "", 
      telegram_url: "", 
      footer_description: "" 
    } as SiteConfig; // Initialize with empty strings, will be merged with default later

    for (const row of rows.slice(1)) {
      if (row[0] && row[1] !== undefined && row[1] !== null) {
        const key = row[0].toString().trim() as keyof SiteConfig
        // Solo actualizar si el valor de la hoja no es una cadena vacía
        if (key in config && row[1].toString().trim() !== '') {
          config[key] = row[1].toString().trim()
        }
      }
    }
    return config
  } catch (error) {
    console.error("Error al obtener configuracion de Google Sheet:", error)
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
  } catch (error) {
    console.error("Error al escribir configuracion en Google Sheet:", error)
    return false
  }
}
