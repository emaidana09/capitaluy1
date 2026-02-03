"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import useSWR from "swr"
import { useConfig } from "@/lib/config-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { ArrowLeft, Send, Wallet, ArrowRightLeft } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface PriceData {
  cryptos: { id: string; buyPrice: number; sellPrice: number }[]
}

function buildMessage(
  type: "buy" | "sell",
  price: number,
  amountUsd: string
): string {
  const cotizacion = price.toLocaleString("es-UY", { minimumFractionDigits: 2 })
  if (type === "buy") {
    return (
      `Compro USDT a cotización $${cotizacion}\n` +
      `Monto a comprar: ${amountUsd || "[X]"} USD.\n` +
      "Pago en pesos uruguayos por transferencia."
    )
  }
  return (
    `Vendo USDT a cotización $${cotizacion}\n` +
    `Monto a vender: ${amountUsd || "[X]"} USD.\n` +
    "Recibo pesos uruguayos por transferencia."
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") === "sell" ? "sell" : "buy") as "buy" | "sell"
  const { config } = useConfig()
  const { data } = useSWR<PriceData>("/api/prices", fetcher)
  const usdt = data?.cryptos?.find((c) => c.id === "usdt")
  const price = type === "buy" ? usdt?.buyPrice : usdt?.sellPrice
  const cotizacion = price
    ? price.toLocaleString("es-UY", { minimumFractionDigits: 2 })
    : "---"

  const [amountUsd, setAmountUsd] = useState("")
  const [highlighted, setHighlighted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Focus input and enable persistent highlight when arriving to checkout
  useEffect(() => {
    setHighlighted(true)
    setTimeout(() => {
      try {
        inputRef.current?.focus()
      } catch {}
    }, 120)
  }, [])
  const handleSend = () => {
    const message = buildMessage(type, price ?? 0, amountUsd.trim() || "[X]")
    window.open(
      `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  const messagePreview = buildMessage(
    type,
    price ?? 0,
    amountUsd.trim() || "[X]"
  )

  return (
    <main className="min-h-screen bg-background dark:bg-black w-full overflow-x-hidden">
      <Header />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
          <Link
            href="/#cotizacion"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a cotizacion
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card dark:bg-neutral-900 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  type === "buy"
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {type === "buy" ? (
                  <Wallet className="w-7 h-7" />
                ) : (
                  <ArrowRightLeft className="w-7 h-7" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold uppercase tracking-tight">
                  {type === "buy" ? "COMPRA" : "VENTA"} DE USDT
                </h1>
                <p className="text-white text-sm">
                  Cotización actual: ${cotizacion} UYU / USDT
                </p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-6">
              Completa el monto y envia el mensaje por WhatsApp. Te responderemos
              a la brevedad.
            </p>

            <div className="space-y-2 mb-6">
              <Label htmlFor="amount">
                Monto a {type === "buy" ? "comprar" : "vender"} (USD)
              </Label>
              <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 100"
                  value={amountUsd}
                  onChange={(e) => {
                    // Permitir solo números y decimales
                    const val = e.target.value.replace(/[^\d.]/g, "")
                    setAmountUsd(val)
                  }}
                  className={`text-lg transition-shadow duration-200 ${highlighted ? "ring-2 ring-green-400/40 bg-green-50 border-green-300 text-green-900" : ""} dark:text-white`}
                  ref={inputRef}
              />
            </div>

            <div className={`rounded-lg p-4 mb-6 ${highlighted ? "bg-green-50 border border-green-200" : "bg-muted/50 border border-border"} dark:!bg-neutral-950 dark:!border-white`}>
              <p className="text-xs text-muted-foreground mb-2">Vista previa del mensaje:</p>
              <p className="message-preview-small text-green-900 dark:text-white whitespace-pre-line font-sans leading-relaxed font-medium break-words">
                {messagePreview}
              </p>
            </div>

            <Button
              onClick={handleSend}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar mensaje por WhatsApp
            </Button>
          </motion.div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

import "./custom-checkout.css"



// Mostrar loader solo en el primer render de la vida de la página (refresh o ingreso directo)

// Loader en cada refresh real o ingreso directo usando sessionStorage
function useFirstLoad() {
  const [firstLoad, setFirstLoad] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Si no hay flag, es refresh o ingreso directo
      if (!window.sessionStorage.getItem('checkout_visited')) {
        setFirstLoad(true)
        window.sessionStorage.setItem('checkout_visited', '1')
      }
      // Limpiar flag en cada refresh real
      const clearFlag = () => {
        window.sessionStorage.removeItem('checkout_visited')
      }
      window.addEventListener('beforeunload', clearFlag)
      return () => window.removeEventListener('beforeunload', clearFlag)
    }
  }, [])
  return firstLoad
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
