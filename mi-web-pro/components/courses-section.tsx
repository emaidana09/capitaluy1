"use client"

import { motion } from "framer-motion"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useConfig } from "@/lib/config-context"
import {
  Clock,
  Users,
  Star,
  BookOpen,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import type { Course } from "@/app/api/courses/route"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.25,
      ease: "easeOut",
    },
  }),
}

export default function CoursesSection() {
  const { config } = useConfig()
  const { data } = useSWR<{ courses: Course[] }>("/api/courses", fetcher)
  const courses = data?.courses ?? []
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-3 h-3 mr-1" /> Educacion Cripto
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Aprende sobre{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Criptomonedas
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Cursos disenados para todos los niveles. Desde
              principiantes hasta traders avanzados.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">
            Cursos Disponibles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <CourseCard course={course} whatsappNumber={config.whatsapp_number} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Learn Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-balance">
              Por que aprender con nosotros
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mas de 5 anos de experiencia en el mercado cripto nos respaldan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Contenido Actualizado",
                description: "Material siempre al dia con las ultimas tendencias del mercado",
              },
              {
                icon: Users,
                title: "Grupos Reducidos",
                description: "Atencion personalizada y resolucion de dudas en tiempo real",
              },
              {
                icon: TrendingUp,
                title: "Enfoque Practico",
                description: "Aprende haciendo con ejercicios y casos reales",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function CourseCard({ course, whatsappNumber }: { course: Course; whatsappNumber: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col group hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Course Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        {course.images && course.images.length > 0 ? (
          <img src={course.images[0].data} alt={course.images[0].name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary/30" />
          </div>
        )}
        <Badge className={`absolute top-4 left-4 ${course.levelColor}`}>
          {course.level}
        </Badge>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow">
          {course.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-4">
          {(course.features || []).slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students}+</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-chart-3 fill-chart-3" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-2xl font-bold text-primary">
            ${course.price.toLocaleString("es-UY")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {course.currency}
            </span>
          </span>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground group/btn"
          >
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa el curso: ${course.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Inscribirme
              <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
