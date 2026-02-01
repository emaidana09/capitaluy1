"use client"

import { Suspense, useState } from "react"
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
    <main className="min-h-screen bg-background w-full overflow-x-hidden">
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
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
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
                <h1 className="text-2xl font-bold">
                  {type === "buy" ? "COMPRA" : "VENTA"} DE USDT
                </h1>
                <p className="text-muted-foreground text-sm">
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
                type="text"
                inputMode="numeric"
                placeholder="Ej: 100"
                value={amountUsd}
                onChange={(e) => setAmountUsd(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="rounded-lg bg-muted/50 border border-border p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2">
                Vista previa del mensaje:
              </p>
              <p className="text-sm text-foreground whitespace-pre-line font-mono">
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
