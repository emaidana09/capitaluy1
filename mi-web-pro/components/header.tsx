"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, Square } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") setShowAdmin((v) => !v)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <nav className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-20 flex items-center min-w-0 relative">
        {/* Logo - CAPITAL UY */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 group min-w-0 shrink-0 mx-auto">
            <Image 
              src="/logo.png" 
              alt="CapitalUY" 
              width={220} 
              height={80} 
              className="h-16 w-auto md:h-20 transition-all duration-200 mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - centrado */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-7">
          <Link
            href="/"
            className={
              pathname === "/" || pathname === "/checkout"
                ? "text-white dark:text-capital font-bold relative px-3 transition-colors duration-200"
                : "text-foreground/80 hover:text-white relative px-3 transition-colors duration-200"
            }
          >
            Comerciar
            {(pathname === "/" || pathname === "/checkout") && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 w-full animate-grow-bar bg-white dark:bg-capital origin-center" />
            )}
          </Link>
          <Link
            href="/nosotros"
            className={
              pathname === "/nosotros"
                ? "text-white dark:text-white font-bold relative px-3 transition-colors duration-200"
                : "text-foreground/80 hover:text-white relative px-3 transition-colors duration-200"
            }
          >
            Nosotros
            {pathname === "/nosotros" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 w-full animate-grow-bar bg-white origin-center" />
            )}
          </Link>
          <Link
            href="/contacto"
            className={
              pathname === "/contacto"
                ? "text-white dark:text-white font-bold relative px-3 transition-colors duration-200"
                : "text-foreground/80 hover:text-white relative px-3 transition-colors duration-200"
            }
          >
            Contacto
            {pathname === "/contacto" && (
              <span className="absolute left-0 right-0 bottom-0 h-0.5 w-full animate-grow-bar bg-white origin-center" />
            )}
          </Link>
          <span className="text-gray-600 dark:text-gray-500 cursor-not-allowed flex items-center gap-2 px-3">
            <span>Cursos</span>
            <span className="text-xs text-accent not-italic">(Próximamente)</span>
          </span>
        </div>

        {/* Desktop Actions - Admin Only */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          <div style={{ visibility: showAdmin ? "visible" : "hidden" }}>
            <Link href="/admin">
              <Button variant="outline" className="border-border hover:bg-secondary bg-transparent gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle - right aligned, square button, menu icon */}
        <button
          className="md:hidden p-3 border border-border bg-background/80 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary absolute right-10 top-1/2 -translate-y-1/2 z-20"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ borderRadius: 0 }}
        >
          {mobileMenuOpen ? (
            <X className="w-7 h-7 text-primary" />
          ) : (
            <Menu className="w-7 h-7 text-primary drop-shadow-lg" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border transition-all duration-300",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-2 items-center">
          {/* Logo y CapitalUY grande */}
          <Link href="/" className="flex flex-col items-center mb-2" onClick={() => setMobileMenuOpen(false)}>
            <Image 
              src="/logo.png" 
              alt="CapitalUY" 
              width={120} 
              height={40} 
              className="h-12 w-auto mb-1" 
              priority
            />
            <span className="text-3xl font-extrabold tracking-tight text-white leading-tight">Capital<span className="text-green-400">UY</span></span>
          </Link>
          {/* Menú móvil ordenado igual que web */}
          <nav className="w-full flex flex-col gap-1 mt-2">
            <Link
              href="/#cotizacion"
              className="py-2 text-base text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comerciar
            </Link>
            <Link
              href="/nosotros"
              className="py-2 text-base text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="py-2 text-base text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            <span className="py-2 text-base text-gray-400 cursor-not-allowed flex items-center gap-2">
              Cursos
              <span className="text-xs text-accent">(Próximamente)</span>
            </span>
          </nav>
          <div className="pt-4 border-t border-border w-full">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full bg-transparent gap-2 text-sm">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
