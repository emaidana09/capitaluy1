"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo.png" 
            alt="CapitalUY" 
            width={180} 
            height={60} 
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/#cotizacion" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Comerciar
          </Link>

          <Link 
            href="/aprender" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Cursos
          </Link>

          <Link 
            href="/nosotros" 
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Nosotros
          </Link>
        </div>

        {/* Desktop Actions - Admin Only */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" className="border-border hover:bg-secondary bg-transparent gap-2">
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
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
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <Link
            href="/#cotizacion"
            className="py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Comerciar
          </Link>
          <Link
            href="/aprender"
            className="py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cursos
          </Link>
          <Link
            href="/nosotros"
            className="py-2 text-foreground/80 hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Nosotros
          </Link>
          <div className="pt-4 border-t border-border">
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full bg-transparent gap-2">
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
