"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { useConfig } from "@/lib/config-context"

export default function WhatsAppButton() {
  const config = useConfig()
  return (
    <motion.a
      href={`https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent("Hola, tengo una consulta sobre criptomonedas")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      <span className="sr-only">Contactar por WhatsApp</span>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  )
}
