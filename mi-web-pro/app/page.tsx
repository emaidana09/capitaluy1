"use client"

import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import ServicesWithPrice from "@/components/services-with-price"
import SupportSection from "@/components/support-section"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import IntroAnimation from "@/components/intro-animation"

export default function Home() {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      <IntroAnimation onComplete={() => setShowContent(true)} />
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
