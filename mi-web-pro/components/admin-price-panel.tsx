"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Settings,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  Upload,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Edit3,
  X,
} from "lucide-react"
import useSWR, { mutate } from "swr"

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  buyPrice: number
  sellPrice: number
  enabled: boolean
  lastUpdated: string
}

interface PriceData {
  cryptos: CryptoPrice[]
  lastUpdated: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const cryptoIcons: Record<string, string> = {
  usdt: "₮",
  btc: "₿",
  eth: "Ξ",
  bnb: "B",
  sol: "◎",
  xrp: "✕",
  ada: "₳",
  dot: "●",
  ltc: "Ł",
  doge: "Ð",
}

export default function AdminPricePanel() {
  const { data, isLoading } = useSWR<PriceData>("/api/prices", fetcher)
  const [editingCrypto, setEditingCrypto] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ buyPrice: string; sellPrice: string }>({ buyPrice: "", sellPrice: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCrypto, setNewCrypto] = useState({ symbol: "", name: "", buyPrice: "", sellPrice: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAction = async (action: string, actionData: Record<string, unknown>) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data: actionData }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to process request")
      }

      setSubmitStatus({ type: "success", message: "Cambios guardados correctamente" })
      mutate("/api/prices")
    } catch (err) {
      setSubmitStatus({ type: "error", message: err instanceof Error ? err.message : "Error al procesar" })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 3000)
    }
  }

  const startEditing = (crypto: CryptoPrice) => {
    setEditingCrypto(crypto.id)
    setEditValues({
      buyPrice: crypto.buyPrice.toString(),
      sellPrice: crypto.sellPrice.toString(),
    })
  }

  const saveEdit = async (id: string) => {
    await handleAction("update", {
      id,
      buyPrice: Number.parseFloat(editValues.buyPrice),
      sellPrice: Number.parseFloat(editValues.sellPrice),
    })
    setEditingCrypto(null)
  }

  const addCrypto = async () => {
    if (!newCrypto.symbol || !newCrypto.name) return
    await handleAction("add", {
      symbol: newCrypto.symbol,
      name: newCrypto.name,
      buyPrice: Number.parseFloat(newCrypto.buyPrice) || 0,
      sellPrice: Number.parseFloat(newCrypto.sellPrice) || 0,
    })
    setNewCrypto({ symbol: "", name: "", buyPrice: "", sellPrice: "" })
    setShowAddForm(false)
  }

  const deleteCrypto = async (id: string) => {
    if (window.confirm("¿Estas seguro de eliminar esta criptomoneda?")) {
      await handleAction("delete", { id })
    }
  }

  const toggleCrypto = async (id: string) => {
    await handleAction("toggle", { id })
  }

  const exportToCSV = () => {
    if (!data?.cryptos) return
    
    const headers = "Symbol,Name,BuyPrice,SellPrice,Enabled"
    const rows = data.cryptos.map(
      (c) => `${c.symbol},${c.name},${c.buyPrice},${c.sellPrice},${c.enabled}`
    )
    const csv = [headers, ...rows].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `capitaluy_precios_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const csvData = event.target?.result as string
      await handleAction("import", { csvData })
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const calculateSpread = (buy: number, sell: number) => {
    if (buy === 0) return "0.00"
    return (((buy - sell) / buy) * 100).toFixed(2)
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Panel de Administracion
          </h1>
          <p className="text-muted-foreground">
            Gestiona las cotizaciones de criptomonedas
          </p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 flex items-center justify-center gap-2 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Excel Import/Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-accent" />
                Importar / Exportar Excel (CSV)
              </CardTitle>
              <CardDescription>
                Descarga o sube un archivo CSV para actualizar todas las cotizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                  Descargar CSV
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={importFromCSV}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Upload className="w-4 h-4" />
                  Importar CSV
                </Button>
                <div className="flex-1 min-w-[200px] p-3 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Formato del archivo:</p>
                  <code className="text-xs">Symbol,Name,BuyPrice,SellPrice,Enabled</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add New Crypto Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Cancelar" : "Agregar Criptomoneda"}
          </Button>
        </motion.div>

        {/* Add New Crypto Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="bg-card border-border border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Nueva Criptomoneda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-symbol">Simbolo</Label>
                      <Input
                        id="new-symbol"
                        placeholder="USDC"
                        value={newCrypto.symbol}
                        onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value.toUpperCase() })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Nombre</Label>
                      <Input
                        id="new-name"
                        placeholder="USD Coin"
                        value={newCrypto.name}
                        onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-buy">Precio Compra (UYU)</Label>
                      <Input
                        id="new-buy"
                        type="number"
                        step="0.01"
                        placeholder="43.50"
                        value={newCrypto.buyPrice}
                        onChange={(e) => setNewCrypto({ ...newCrypto, buyPrice: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-sell">Precio Venta (UYU)</Label>
                      <Input
                        id="new-sell"
                        type="number"
                        step="0.01"
                        placeholder="42.80"
                        value={newCrypto.sellPrice}
                        onChange={(e) => setNewCrypto({ ...newCrypto, sellPrice: e.target.value })}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addCrypto}
                    disabled={!newCrypto.symbol || !newCrypto.name || isSubmitting}
                    className="mt-4"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Agregar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crypto List */}
        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Cargando cotizaciones...</p>
            </div>
          ) : (
            data?.cryptos.map((crypto, i) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`bg-card border-border transition-all ${!crypto.enabled ? "opacity-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Crypto Info */}
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                          {cryptoIcons[crypto.id] || crypto.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{crypto.symbol}</h3>
                          <p className="text-sm text-muted-foreground">{crypto.name}</p>
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                        {editingCrypto === crypto.id ? (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-accent" /> Compra
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editValues.buyPrice}
                                  onChange={(e) => setEditValues({ ...editValues, buyPrice: e.target.value })}
                                  className="pl-7 h-9 bg-input border-border"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 text-primary" /> Venta
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editValues.sellPrice}
                                  onChange={(e) => setEditValues({ ...editValues, sellPrice: e.target.value })}
                                  className="pl-7 h-9 bg-input border-border"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-accent" /> Compra
                              </p>
                              <p className="text-xl font-bold text-accent">
                                ${crypto.buyPrice.toLocaleString("es-UY", { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="w-3 h-3 text-primary" /> Venta
                              </p>
                              <p className="text-xl font-bold text-primary">
                                ${crypto.sellPrice.toLocaleString("es-UY", { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </>
                        )}

                        {/* Spread */}
                        <div className="hidden md:block">
                          <p className="text-xs text-muted-foreground">Spread</p>
                          <p className="text-lg font-semibold">
                            {calculateSpread(crypto.buyPrice, crypto.sellPrice)}%
                          </p>
                        </div>

                        {/* Last Updated */}
                        <div className="hidden md:block">
                          <p className="text-xs text-muted-foreground">Actualizado</p>
                          <p className="text-sm">
                            {new Date(crypto.lastUpdated).toLocaleTimeString("es-UY")}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {editingCrypto === crypto.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(crypto.id)}
                              disabled={isSubmitting}
                              className="bg-accent hover:bg-accent/90"
                            >
                              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCrypto(null)}
                              className="bg-transparent"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(crypto)}
                              className="bg-transparent"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleCrypto(crypto.id)}
                              className="bg-transparent"
                            >
                              {crypto.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCrypto(crypto.id)}
                              className="bg-transparent text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-accent" />
                Como usar el archivo Excel
              </h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Descarga el archivo CSV haciendo clic en &quot;Descargar CSV&quot;</li>
                <li>Abre el archivo con Excel, Google Sheets o cualquier editor de hojas de calculo</li>
                <li>Modifica los precios de compra (BuyPrice) y venta (SellPrice) segun necesites</li>
                <li>Guarda el archivo en formato CSV</li>
                <li>Sube el archivo usando &quot;Importar CSV&quot;</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
