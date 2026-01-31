"use client"

import { motion } from "framer-motion"
import { Wallet, ArrowRightLeft } from "lucide-react"

const WHATSAPP_NUMBER = "59899123456" // Replace with actual WhatsApp number

const services = [
  {
    id: "comprar",
    title: "Comprar",
    description:
      "Compra USDT de forma segura y rapida. Nuestro equipo te guiara de manera personalizada para darte tranquilidad.",
    icon: Wallet,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, me interesa comprar")}`,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "hover:border-primary/50",
    glowColor: "group-hover:shadow-primary/20",
  },
  {
    id: "vender",
    title: "Vender",
    description:
      "Vende tus USDT al mejor precio del mercado. Te contamos como vender de forma simple y directa.",
    icon: ArrowRightLeft,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, me interesa vender")}`,
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    borderColor: "hover:border-accent/50",
    glowColor: "group-hover:shadow-accent/20",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.3 },
  },
}

export default function ServiceCards() {
  return (
    <section className="py-20 px-4" id="servicios">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Nuestros Servicios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Compra y vende USDT de forma segura y confiable
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <a
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <ServiceCard service={service} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
}: {
  service: (typeof services)[0]
}) {
  const Icon = service.icon

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl border border-border bg-gradient-to-b ${service.color} p-10 h-full min-h-[280px] cursor-pointer group transition-all duration-300 ${service.borderColor} hover:shadow-xl ${service.glowColor}`}
    >
      <div className="relative z-10 flex flex-col h-full">
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className={`w-20 h-20 rounded-xl bg-secondary/50 flex items-center justify-center mb-6 ${service.iconColor}`}
        >
          <Icon className="w-10 h-10" />
        </motion.div>

        <h3 className="text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed text-pretty text-lg">
          {service.description}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}
