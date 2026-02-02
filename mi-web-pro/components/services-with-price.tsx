"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ArrowRightLeft, TrendingUp, TrendingDown, CheckCircle, Clock, Shield } from "lucide-react"
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

const getServices = () => [
  {
    id: "comprar",
    title: "Comprar",
    description: "Compra USDT de forma segura y rapida. Te guiamos en cada paso.",
    icon: Wallet,
    href: "/checkout?type=buy",
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    borderColor: "hover:border-accent/50",
    priceType: "buy" as const,
  },
  {
    id: "vender",
    title: "Vender",
    description: "Vende tus USDT al mejor precio. Proceso simple y directo.",
    icon: ArrowRightLeft,
    href: "/checkout?type=sell",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "hover:border-primary/50",
    priceType: "sell" as const,
  },
]

const stats = [
  { value: "463+", label: "Operaciones en 30 dias", icon: TrendingUp },
  { value: "97.27%", label: "Tasa completada", icon: CheckCircle },
  { value: "3.78 min", label: "Tiempo promedio", icon: Clock },
  { value: "100%", label: "Feedback positivo", icon: Shield },
]

export default function ServicesWithPrice() {
  const services = getServices()
  const { data, isLoading } = useSWR<PriceData>("/api/prices", fetcher, {
    refreshInterval: 30000,
  })

  const usdt = data?.cryptos.find((c) => c.id === "usdt")

  return (
    <section className="pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 scroll-mt-24 overflow-visible" id="cotizacion">
      <div className="w-full max-w-5xl mx-auto overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8 overflow-visible px-3 py-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 overflow-visible leading-tight min-h-[1.2em] py-1">
            Cotizacion USDT
          </h2>
          <p className="text-muted-foreground">
            Precios actualizados en tiempo real
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon
            const price = service.priceType === "buy" ? usdt?.buyPrice : usdt?.sellPrice
            const PriceIcon = service.priceType === "buy" ? TrendingUp : TrendingDown

            return (
              <Link key={service.id} href={service.href} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-b ${service.color} p-8 cursor-pointer group transition-all duration-300 ${service.borderColor} hover:shadow-xl flex flex-col min-h-[320px] h-full`}
              >
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className={`w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center ${service.iconColor}`}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <PriceIcon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {service.description}
                </p>

                {/* Price Display */}
                <div className="pt-4 border-t border-border/50 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`price-${price}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`text-3xl md:text-4xl font-bold ${service.iconColor}`}
                      >
                        {isLoading ? (
                          <span className="animate-pulse">---</span>
                        ) : (
                          `$${price?.toLocaleString("es-UY", { minimumFractionDigits: 2 }) || "---"}`
                        )}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-muted-foreground text-sm">UYU / USDT</span>
                  </div>
                </div>

                {/* Hover effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Stats - smaller, below Comprar/Vender */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto mt-8"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <stat.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {data?.lastUpdated && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-muted-foreground mt-4"
          >
            Actualizado: {new Date(data.lastUpdated).toLocaleString("es-UY")}
          </motion.p>
        )}
      </div>
    </section>
  )
}
