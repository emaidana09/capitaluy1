"use client"

import { motion } from "framer-motion"
import useSWR from "swr"
import { Shield, Clock, Headphones, Zap } from "lucide-react"
import dynamic from "next/dynamic"
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

const defaultContent = {
  commitmentTitle: "Nuestro Compromiso",
  commitmentHomeText: "Con mas de 463 operaciones completadas en los ultimos 30 dias y un 97.27% de tasa de exito, nos dedicamos a brindarte la mejor experiencia en compra y venta de USDT. Nuestro tiempo promedio de pago es de solo 3.12 minutos.",
  features: [
    { title: "100% Seguro", description: "Transacciones protegidas y verificadas" },
    { title: "Rapido", description: "Tiempo promedio de pago: 3.12 minutos" },
    { title: "Soporte Personalizado", description: "Atencion directa por WhatsApp" },
    { title: "Sin complicaciones", description: "Proceso simple y directo" },
  ],
  references: [
    { name: "Juan Perez", description: "Excelente servicio y atención" },
    { name: "Maria Gomez", description: "Rápido y seguro, muy recomendable" },
    { name: "Carlos Ruiz", description: "Siempre cumplen, muy confiable" },
  ],
}

export default function SupportSection() {
  const { data, error } = useSWR<AboutContent>("/api/about", fetcher)
  if (!data && !error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="nosotros">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="h-8 w-56 rounded bg-muted animate-pulse" />
              <div className="h-5 w-full rounded bg-muted animate-pulse" />
              <div className="h-5 w-5/6 rounded bg-muted animate-pulse" />
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-[400px] rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  const content = data ?? defaultContent
  const references = (content.references?.length ? content.references : defaultContent.references).slice(0, 3)
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="nosotros">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-balance">
              {content.commitmentTitle}
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-pretty">
              {content.commitmentHomeText || content.commitmentText}
            </p>

            {references.length > 0 && (
              <div className="grid gap-3 mb-6 sm:mb-8">
                {references.map((ref) => (
                  <div
                    key={ref.name}
                    className="relative overflow-hidden rounded-lg border border-border bg-card/60 p-4"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <p className="font-semibold text-foreground pl-3">{ref.name}</p>
                    <p className="text-sm text-muted-foreground pl-3">{ref.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {(content.features || defaultContent.features).map((feature, i) => {
                const Icon = featureIcons[i] ?? Shield
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
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
                )
              })}
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
