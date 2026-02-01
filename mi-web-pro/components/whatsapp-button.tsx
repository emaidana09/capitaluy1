"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"
import { useConfig } from "@/lib/config-context"
import { Button } from "@/components/ui/button"

export default function WhatsAppButton() {
  const { config } = useConfig()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSend = () => {
    const text = message.trim() || "Hola, tengo una consulta sobre criptomonedas"
    window.open(
      `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(text)}`,
      "_blank"
    )
    setMessage("")
    setOpen(false)
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
        <span className="sr-only">Abrir chat</span>
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-card border-t border-border rounded-t-2xl shadow-2xl max-h-[50vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chat con CapitalUY</h3>
                    <p className="text-sm text-muted-foreground">Escribe tu mensaje y se abrira WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hola, tengo una consulta sobre criptomonedas"
                  className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
