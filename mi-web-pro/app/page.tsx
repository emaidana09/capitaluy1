"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import ServicesWithPrice from "@/components/services-with-price"
import SupportSection from "@/components/support-section"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import IntroAnimation from "@/components/intro-animation"

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detectar refresh real o ingreso directo y limpiar flag SOLO en refresh
      let isReload = false;
      if (window.performance && window.performance.getEntriesByType) {
        const navs = window.performance.getEntriesByType("navigation");
        if (navs.length > 0 && navs[0].type === "reload") {
          isReload = true;
        }
      } else if (window.performance && window.performance.navigation) {
        isReload = window.performance.navigation.type === 1;
      }
      if (isReload) {
        window.sessionStorage.removeItem('home_intro_played');
      }

      // Si el flag no existe, mostrar intro (pero NO setearlo aquí)
      if (!window.sessionStorage.getItem('home_intro_played')) {
        setShowIntro(true)
      } else {
        setShowContent(true)
      }
    }
  }, [])

  return (
    <>
      {showIntro && (
        <IntroAnimation onComplete={() => {
          setShowContent(true)
          setShowIntro(false)
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('home_intro_played', '1')
          }
        }} />
      )}
      {showContent && (
        <main className="min-h-screen bg-background w-full overflow-x-hidden">
          <Header />
          <Hero />
          <ServicesWithPrice />
          <SupportSection />
          <Footer />
          <WhatsAppButton />
        </main>
      )}
    </>
  )
}
