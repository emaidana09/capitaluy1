"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Headphones, Zap } from "lucide-react"
import dynamic from "next/dynamic"

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

export default function SupportSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="nosotros">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-balance">
              Nuestro Compromiso
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              Con mas de 463 operaciones completadas en los ultimos 30 dias y un 
              97.27% de tasa de exito, nos dedicamos a brindarte la mejor 
              experiencia en compra y venta de USDT. Nuestro tiempo promedio de 
              pago es de solo 3.12 minutos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Coins */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <CryptoCoins3D />
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
