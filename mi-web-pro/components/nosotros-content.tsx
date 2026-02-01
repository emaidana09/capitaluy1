"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import useSWR from "swr"
import { Shield, Clock, Headphones, Zap, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import type { AboutContent } from "@/app/api/about/route"

const CryptoCoins3D = dynamic(() => import("./crypto-coins-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  ),
})

const featureIcons = [Shield, Clock, Headphones, Zap]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NosotrosContent() {
  const { data: about } = useSWR<AboutContent>("/api/about", fetcher)
  const content = about ?? {
    title: "Sobre Nosotros",
    intro: "Somos tu plataforma de confianza para comprar y vender USDT en Uruguay.",
    historyTitle: "Nuestra Historia",
    historyText: "CapitalUY nacio con la mision de simplificar el acceso a las criptomonedas en Uruguay.",
    commitmentTitle: "Nuestro Compromiso",
    commitmentText: "Nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT.",
    stats: [
      { value: "463+", label: "Operaciones en 30 dias" },
      { value: "97.27%", label: "Tasa de Completadas" },
      { value: "3.78 min", label: "Tiempo Promedio Liberacion" },
      { value: "100%", label: "Feedback Positivo (102)" },
    ],
    features: [
      { title: "100% Seguro", description: "Transacciones protegidas y verificadas" },
      { title: "Rapido", description: "Tiempo promedio de pago: 3.12 minutos" },
      { title: "Soporte Personalizado", description: "Atencion directa por WhatsApp" },
      { title: "Sin complicaciones", description: "Proceso simple y directo" },
    ],
  }

  const statIcons = [TrendingUp, CheckCircle, Clock, Shield]

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            {content.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {content.intro}
          </p>
        </motion.div>

        {/* Story & Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 space-y-6"
        >
          <h2 className="text-2xl font-bold">{content.historyTitle}</h2>
          <div className="text-lg text-muted-foreground leading-relaxed text-pretty whitespace-pre-line">
            {content.historyText}
          </div>
          <h2 className="text-2xl font-bold pt-4">{content.commitmentTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            {content.commitmentText}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-4xl mx-auto">
          {content.stats.map((stat, i) => {
            const Icon = statIcons[i] ?? Shield
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Por que elegirnos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {content.features.map((feature, i) => {
              const Icon = featureIcons[i] ?? Shield
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* 3D Coins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl mx-auto"
        >
          <CryptoCoins3D />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">Listo para operar?</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/#cotizacion" className="gap-2">
              Ver cotizacion actual
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
