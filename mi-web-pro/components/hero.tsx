"use client"

import { motion } from "framer-motion"

const easing = [0.25, 0.46, 0.45, 0.94]

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[80vh] flex items-center justify-center pt-20 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      {/* Subtle animated orbs - smooth, performant */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] w-64 h-64 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[8%] w-72 h-72 sm:w-96 sm:h-96 bg-accent/8 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content - centered on all viewports */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center min-w-0">
          {/* CAPITAL UY - Main brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing }}
              className="mb-6 sm:mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[8rem] font-bold tracking-tight leading-[0.9] select-none">
              <span className="inline-block text-white">
                CAPITAL
              </span>
              <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-br from-green-300 via-green-500 to-green-700">
                UY
              </span>
            </h1>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easing }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 sm:mb-10 origin-center"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easing }}
            className="text-xl sm:text-2xl md:text-3xl text-foreground max-w-3xl mx-auto text-pretty font-semibold leading-relaxed"
          >
            Compra y vende{" "}
            <span className="text-primary font-bold">USDT</span>
            {" "}de forma segura en Uruguay
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: easing }}
            className="text-base sm:text-lg text-muted-foreground/90 mt-4 max-w-2xl mx-auto font-light"
          >
            Tu plataforma de confianza. Asesoramiento personalizado y las mejores cotizaciones.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
