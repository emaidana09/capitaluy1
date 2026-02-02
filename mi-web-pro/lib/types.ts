export type CryptoPrice = {
  id: string
  symbol: string
  name: string
  buyPrice: number
  sellPrice: number
  enabled: boolean
  lastUpdated: string
}

export type SiteConfig = {
  whatsapp_number: string
  email: string
  phone_display: string
  address: string
  instagram_url: string
  twitter_url: string
  telegram_url: string
  footer_description: string
}
