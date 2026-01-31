"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import useSWR from "swr"

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  buyPrice: number
  sellPrice: number
  enabled: boolean
  lastUpdated: string
}

interface PriceData {
  cryptos: CryptoPrice[]
  lastUpdated: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PriceDisplay() {
  const { data, isLoading } = useSWR<PriceData>("/api/prices", fetcher, {
    refreshInterval: 30000,
  })

  // Get only USDT
  const usdt = data?.cryptos.find((c) => c.id === "usdt")

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card/50" id="cotizacion">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Cotizacion USDT
          </h2>
          <p className="text-muted-foreground mb-6">
            Precios actualizados en tiempo real
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Buy Price */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-8 group hover:border-accent/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Precio de Compra
              </span>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`buy-${usdt?.buyPrice}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-4xl md:text-5xl font-bold text-accent"
                >
                  {isLoading ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    `$${usdt?.buyPrice.toLocaleString("es-UY", { minimumFractionDigits: 2 }) || "---"}`
                  )}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground">UYU</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Por 1 USDT
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Sell Price */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-8 group hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Precio de Venta
              </span>
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`sell-${usdt?.sellPrice}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-4xl md:text-5xl font-bold text-primary"
                >
                  {isLoading ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    `$${usdt?.sellPrice.toLocaleString("es-UY", { minimumFractionDigits: 2 }) || "---"}`
                  )}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground">UYU</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Por 1 USDT
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>

        {data?.lastUpdated && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Ultima actualizacion:{" "}
            {new Date(data.lastUpdated).toLocaleString("es-UY")}
          </motion.p>
        )}
      </div>
    </section>
  )
}
