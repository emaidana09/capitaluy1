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

const fallbackReferences = [
  { name: "Sofía Martínez", description: "Atención impecable y operación muy clara." },
  { name: "Matías Pereira", description: "Cobro rápido y comunicación excelente." },
  { name: "Camila Rodríguez", description: "Todo el proceso fue seguro y transparente." },
  { name: "Federico Álvarez", description: "Muy buena cotización y respuesta inmediata." },
  { name: "Valentina Suárez", description: "Servicio serio, ordenado y sin sorpresas." },
  { name: "Nicolás Fernández", description: "Recomendable, se nota el profesionalismo." },
  { name: "Lucía Cabrera", description: "Operé varias veces y siempre salió perfecto." },
  { name: "Agustín Silva", description: "Rápido, simple y con excelente soporte." },
  { name: "Martina González", description: "Muy buena experiencia de principio a fin." },
]

export default function NosotrosContent() {
  const { data: about, error } = useSWR<AboutContent>("/api/about", fetcher)
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
    references: [
      { name: "Juan Pérez", description: "Excelente servicio y atención." },
      { name: "María López", description: "Proceso rápido y seguro." },
      { name: "Carlos Gómez", description: "Muy recomendable, todo perfecto." },
      { name: "Ana Torres", description: "Transparencia y buen precio." },
    ],
  }

  const statIcons = [TrendingUp, CheckCircle, Clock, Shield]
  const references = [...(content.references ?? []), ...fallbackReferences]
    .filter((ref, index, list) => {
      const normalizedName = ref.name.trim().toLowerCase()
      return (
        normalizedName.length > 0 &&
        index ===
          list.findIndex((item) => item.name.trim().toLowerCase() === normalizedName)
      )
    })
    .slice(0, 9)
  const desktopReferenceColumns = [0, 1, 2].map((columnIndex) =>
    references.filter((_, index) => index % 3 === columnIndex)
  )

  if (!about && !error) {
    return (
      <section className="pt-10 sm:pt-14 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="h-10 w-64 rounded bg-muted animate-pulse mx-auto" />
          <div className="h-5 w-3/4 rounded bg-muted animate-pulse mx-auto" />
          <div className="h-5 w-2/3 rounded bg-muted animate-pulse mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-10 sm:pt-14 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
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

        {/* Referencias */}
        {references.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center md:text-left">Referencias</h2>
            <div className="md:hidden relative overflow-hidden h-[620px]">
              <div className="reference-track reference-track-mobile">
                {[...references, ...references].map((ref, i) => {
                  const initials = ref.name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()

                  return (
                    <div
                      key={`mobile-${i}-${ref.name}`}
                      className="mb-6 min-h-[190px] rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm"
                    >
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {ref.description}
                      </p>
                      <div className="mt-6 flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{ref.name}</p>
                          <p className="text-sm text-muted-foreground">Cliente verificado</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hidden md:grid md:grid-cols-3 gap-6 md:h-[620px] overflow-hidden">
              {desktopReferenceColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="relative overflow-hidden">
                  <div className={`reference-track reference-track-${columnIndex}`}>
                    {[...column, ...column].map((ref, i) => {
                      const initials = ref.name
                        .split(" ")
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()

                      return (
                        <div
                          key={`${columnIndex}-${i}-${ref.name}`}
                          className="mb-6 min-h-[190px] rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm"
                        >
                          <p className="text-lg leading-relaxed text-muted-foreground">
                            {ref.description}
                          </p>
                          <div className="mt-6 flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{ref.name}</p>
                              <p className="text-sm text-muted-foreground">Cliente verificado</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <style jsx>{`
              @keyframes referencesUp {
                0% {
                  transform: translateY(0%);
                }
                100% {
                  transform: translateY(-50%);
                }
              }

              .reference-track {
                animation-name: referencesUp;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
                will-change: transform;
              }

              .reference-track-mobile {
                animation-duration: 40s;
              }

              @media (max-width: 767px) {
                .reference-track {
                  animation-name: referencesUp;
                  animation-timing-function: linear;
                  animation-iteration-count: infinite;
                  animation-duration: 36s;
                  will-change: transform;
                }
              }

              .reference-track-0 {
                animation-duration: 28s;
                animation-delay: -3s;
              }

              .reference-track-1 {
                animation-duration: 32s;
                animation-delay: -6s;
              }

              .reference-track-2 {
                animation-duration: 36s;
                animation-delay: -9s;
              }
            `}</style>
          </div>
        )}

        {/* 3D Coins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl mx-auto"
        >
          {/* <CryptoCoins3D /> Animación 3D deshabilitada en Nosotros por requerimiento */}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-4">Listo para operar?</p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-base px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-accent hover:to-primary hover:shadow-2xl group"
          >
            <Link href="/#cotizacion" className="flex items-center gap-2 font-bold tracking-wide">
              Ver cotización actual
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
