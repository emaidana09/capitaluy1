"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, User, Eye, EyeOff, AlertCircle, Shield } from "lucide-react"
import Image from "next/image"

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [createMode, setCreateMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (createMode) {
        // Create admin first
        const resCreate = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", username, password }),
        })
        const createData = await resCreate.json()
        if (!createData.success) {
          setError(createData.error || "Error creando admin")
          setIsLoading(false)
          return
        }

        // After creation, attempt login to set session cookie
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "login", username, password }),
        })
        const data = await response.json()
        if (data.success) {
          onLoginSuccess()
        } else {
          setError(data.error || "Cuenta creada, pero no se pudo iniciar sesion")
        }
      } else {
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "login", username, password }),
        })

        const data = await response.json()

        if (data.success) {
          onLoginSuccess()
        } else {
          setError(data.error || "Error al iniciar sesion")
        }
      }
    } catch (err) {
      setError("Error de conexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10 mx-auto"
      >
        <Card className="bg-card/90 backdrop-blur-lg border-border">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 18 }}
              className="mx-auto mb-4"
            >
              <Image 
                src="/logo.png" 
                alt="CapitalUY" 
                width={120} 
                height={120}
                className="h-32 w-auto mx-auto"
              />
            </motion.div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Panel de Admin
            </CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Username field */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-input border-border"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-input border-border"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Ingresar
                  </>
                )}
              </Button>
            </form>

            {/* Security notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-muted-foreground text-center mt-6"
            >
              Acceso restringido solo para administradores
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
