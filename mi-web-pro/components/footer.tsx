"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Twitter, Send } from "lucide-react"
import { useConfig } from "@/lib/config-context"

export default function Footer() {
  const { config } = useConfig()
  const normalize = (u: string | undefined) => {
    if (!u) return "#"
    const s = String(u).trim()
    if (s === "#" || s === "") return "#"
    return /^https?:\/\//i.test(s) ? s : `https://${s}`
  }
  return (
    <footer className="bg-card border-t border-border" id="contacto">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-8 lg:gap-12 text-left">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link href="/" className="inline-block mb-2 text-left pl-0">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-foreground">Capital</span>
                <span className="text-primary">UY</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed text-pretty text-justify max-w-xs pl-0">
              {config.footer_description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-foreground mb-4 text-left">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Comerciar
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <span className="text-gray-700 dark:text-gray-500 cursor-not-allowed flex items-center gap-2">
                  Cursos
                  <span className="text-xs text-accent">(Próximamente)</span>
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-foreground mb-4 text-left">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground min-w-0">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href={`mailto:${config.email}`}
                  className="hover:text-foreground transition-colors break-all min-w-0"
                  style={{ wordBreak: 'break-all' }}
                >
                  {config.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`https://wa.me/${config.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {config.phone_display ? config.phone_display : config.whatsapp_number}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-white mb-4 text-left">Seguinos</h3>
            <div className="flex gap-6 items-center">
              <a
                href={normalize(config.instagram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-all duration-200"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={normalize(config.twitter_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-all duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href={normalize(config.telegram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white hover:text-primary hover:bg-primary/20 transition-all duration-200"
              >
                <Send className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-border mt-8 pt-8 text-left text-sm text-muted-foreground"
        >
          <p className="mx-auto w-full text-left">
            &copy; {new Date().getFullYear()} CapitalUY. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
