"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface IntroAnimationProps {
  onComplete: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
      setTimeout(onComplete, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* Background sweep animation */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent"
          />
          
          {/* Secondary sweep */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent"
          />

          {/* Logo and text container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: "spring",
                stiffness: 100
              }}
            >
              <Image
                src="/logo.png"
                alt="CapitalUY"
                width={300}
                height={150}
                className="h-60 w-auto"
                priority
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-base sm:text-lg text-muted-foreground mt-6"
            >
              Tu plataforma de confianza para USDT
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-8"
            />
          </div>

          {/* Decorative particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                y: "100vh",
                x: `${(i - 2.5) * 20}vw`
              }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: "-100vh",
              }}
              transition={{ 
                duration: 2.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-primary/50"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
