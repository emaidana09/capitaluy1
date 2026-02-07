"use client"

import { motion } from "framer-motion"

const easing = [0.25, 0.46, 0.45, 0.94]

export default function Hero() {
  return (
    <section className="relative min-h-[65vh] sm:min-h-[60vh] flex items-center justify-center pt-20 pb-0 px-4 sm:px-6 lg:px-8">
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
              style={{ marginTop: '0' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing }}
              className="mb-1 sm:mb-3"
          >
            <h1 className="text-[4rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem] font-bold tracking-tight leading-[1.05] select-none">
              <span className="inline-block text-white text-[5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] xl:text-[7.5rem] 2xl:text-[8rem] font-extrabold drop-shadow-lg">
                Capital
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-300 via-green-500 to-green-700 drop-shadow-lg shadow-green-700/40 font-extrabold overflow-visible align-baseline ml-0 text-[5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] xl:text-[7.5rem] 2xl:text-[8rem]">UY</span>
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
            className="text-lg sm:text-2xl md:text-3xl text-foreground max-w-3xl mx-auto text-pretty font-semibold leading-tight mb-2"
          >
            Compra y vende{" "}
            <span className="text-primary font-bold">USDT</span>
            {" "}de forma segura en Uruguay
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: easing }}
            className="text-base sm:text-xl md:text-2xl text-muted-foreground/90 mt-2 max-w-2xl mx-auto font-light"
          >
            Tu plataforma de confianza. Asesoramiento personalizado y las mejores cotizaciones.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
