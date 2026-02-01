"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Shield, Clock, Headphones, Zap, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

const CryptoCoins3D = dynamic(() => import("./crypto-coins-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  ),
})

const features = [
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Transacciones protegidas y verificadas",
  },
  {
    icon: Clock,
    title: "Rapido",
    description: "Tiempo promedio de pago: 3.12 minutos",
  },
  {
    icon: Headphones,
    title: "Soporte Personalizado",
    description: "Atencion directa por WhatsApp",
  },
  {
    icon: Zap,
    title: "Sin complicaciones",
    description: "Proceso simple y directo",
  },
]

const stats = [
  { value: "463+", label: "Operaciones en 30 dias", icon: TrendingUp },
  { value: "97.27%", label: "Tasa de Completadas", icon: CheckCircle },
  { value: "3.78 min", label: "Tiempo Promedio Liberacion", icon: Clock },
  { value: "100%", label: "Feedback Positivo (102)", icon: Shield },
]

export default function NosotrosContent() {
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
            Sobre Nosotros
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Somos tu plataforma de confianza para comprar y vender USDT en Uruguay.
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
          <h2 className="text-2xl font-bold">Nuestra Historia</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            CapitalUY nacio con la mision de simplificar el acceso a las criptomonedas 
            en Uruguay. Identificamos la necesidad de una plataforma confiable donde las 
            personas pudieran comprar y vender USDT de forma rapida, segura y con 
            asesoramiento personalizado.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Hoy nos enorgullece haber completado mas de 463 operaciones en los ultimos 
            30 dias, con una tasa de exito del 97.27% y un tiempo promedio de liberacion 
            de solo 3.12 minutos. Cada transaccion refuerza nuestro compromiso con la 
            transparencia y la mejor experiencia del usuario.
          </p>
          <h2 className="text-2xl font-bold pt-4">Nuestro Compromiso</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT. 
            Atencion personalizada por WhatsApp, precios competitivos y un proceso 
            simple y directo sin complicaciones. Tu seguridad y satisfaccion son 
            nuestra prioridad.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
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
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
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
