"use client"
import React, { useEffect } from "react"
import { ThemeProvider } from 'next-themes'

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme')
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  )
}
