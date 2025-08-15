"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Trash2,
  Type,
  PenTool,
  Mail,
  RotateCcw,
  Copy,
  Eye,
  FileImage,
  FileText,
  History,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

const SIGNATURE_FONTS = [
  { name: "Elegante Schrift", style: "Dancing Script, cursive", category: "elegant" },
  { name: "Klassisch Royal", style: "Great Vibes, cursive", category: "classic" },
  { name: "Modern Chic", style: "Allura, cursive", category: "modern" },
  { name: "Business Pro", style: "Satisfy, cursive", category: "business" },
  { name: "Künstlerisch", style: "Pacifico, cursive", category: "artistic" },
  { name: "Traditionell", style: "Kaushan Script, cursive", category: "traditional" },
  { name: "Luxus Stil", style: "Alex Brush, cursive", category: "luxury" },
  { name: "Romantisch", style: "Amatic SC, cursive", category: "romantic" },
  { name: "Minimalistisch", style: "Caveat, cursive", category: "minimal" },
  { name: "Vintage Charm", style: "Courgette, cursive", category: "vintage" },
  { name: "Dynamisch", style: "Damion, cursive", category: "dynamic" },
  { name: "Formal", style: "Euphoria Script, cursive", category: "formal" },
  { name: "Handgeschrieben", style: "Homemade Apple, cursive", category: "handwritten" },
  { name: "Kreativ", style: "Indie Flower, cursive", category: "creative" },
  { name: "Professionell", style: "Josefin Slab, serif", category: "professional" },
  { name: "Kalligrafisch", style: "Leckerli One, cursive", category: "calligraphy" },
  { name: "Persönlich", style: "Marck Script, cursive", category: "personal" },
  { name: "Natürlich", style: "Nothing You Could Do, cursive", category: "natural" },
  { name: "Spielerisch", style: "Patrick Hand, cursive", category: "playful" },
  { name: "Raffiniert", style: "Pinyon Script, cursive", category: "sophisticated" },
  { name: "Zeitlos", style: "Qwigley, cursive", category: "timeless" },
  { name: "Stilvoll", style: "Rouge Script, cursive", category: "stylish" },
  { name: "Einzigartig", style: "Sacramento, cursive", category: "unique" },
  { name: "Zart", style: "Tangerine, cursive", category: "delicate" },
]

const PRESET_COLORS = [
  { name: "Schwarz", value: "#000000" },
  { name: "Dunkelblau", value: "#1e40af" },
  { name: "Dunkelgrün", value: "#166534" },
  { name: "Bordeaux", value: "#7c2d12" },
  { name: "Lila", value: "#7c3aed" },
  { name: "Grau", value: "#374151" },
  { name: "Braun", value: "#92400e" },
  { name: "Teal", value: "#0f766e" },
]

// 预设签名模板
const SIGNATURE_TEMPLATES = [
  {
    name: "Klassisch Elegant",
    settings: {
      fontIndex: 0,
      fontSize: 48,
      color: "#000000",
      isItalic: false,
      isBold: false,
      isUnderlined: false,
      rotation: 0,
      letterSpacing: 1,
    },
  },
  {
    name: "Business Professional",
    settings: {
      fontIndex: 3,
      fontSize: 44,
      color: "#1e40af",
      isItalic: false,
      isBold: true,
      isUnderlined: true,
      rotation: 0,
      letterSpacing: 0,
    },
  },
  {
    name: "Künstlerisch Modern",
    settings: {
      fontIndex: 4,
      fontSize: 52,
      color: "#7c3aed",
      isItalic: true,
      isBold: false,
      isUnderlined: false,
      rotation: -3,
      letterSpacing: 2,
    },
  },
  {
    name: "Minimalistisch Clean",
    settings: {
      fontIndex: 8,
      fontSize: 40,
      color: "#374151",
      isItalic: false,
      isBold: false,
      isUnderlined: false,
      rotation: 0,
      letterSpacing: 0,
    },
  },
  {
    name: "Vintage Charm",
    settings: {
      fontIndex: 9,
      fontSize: 46,
      color: "#92400e",
      isItalic: false,
      isBold: false,
      isUnderlined: false,
      rotation: 2,
      letterSpacing: 1,
    },
  },
]

interface SignatureHistory {
  id: string
  name: string
  type: "type" | "draw" | "email"
  settings: any
  timestamp: number
  preview: string
}

export function SignatureGenerator() {
  const [activeTab, setActiveTab] = useState("type")
  const [name, setName] = useState("")
  const [fontSize, setFontSize] = useState([48])
  const [color, setColor] = useState("#000000")
  const [selectedFont, setSelectedFont] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderlined, setIsUnderlined] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [rotation, setRotation] = useState([0])
  const [letterSpacing, setLetterSpacing] = useState([0])
  const [isMobile, setIsMobile] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [exportFormat, setExportFormat] = useState("png")
  const [signatureHistory, setSignatureHistory] = useState<SignatureHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Drawing canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokeWidth, setStrokeWidth] = useState([3])
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([])

  // Email signature state
  const [emailData, setEmailData] = useState({
    name: "",
    position: "",
    company: "",
    phone: "",
    website: "",
    email: "",
  })

  // 检查是否为新用户
  useEffect(() => {
    const hasVisited = localStorage.getItem("signature-generator-visited")
    if (!hasVisited) {
      setShowGuide(true)
      localStorage.setItem("signature-generator-visited", "true")
    }

    // 加载历史记录
    const savedHistory = localStorage.getItem("signature-history")
    if (savedHistory) {
      setSignatureHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 字体预加载
  useEffect(() => {
    const loadFonts = async () => {
      const fontPromises = SIGNATURE_FONTS.map((font) => {
        const fontFamily = font.style.split(",")[0].replace(/['"]/g, "")
        return document.fonts.load(`16px "${fontFamily}"`)
      })

      try {
        await Promise.all(fontPromises)
        setFontsLoaded(true)
      } catch (error) {
        console.warn("Some fonts failed to load:", error)
        setFontsLoaded(true) // 继续执行，即使部分字体加载失败
      }
    }

    loadFonts()
  }, [])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile, { passive: true })
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 保存到历史记录
  const saveToHistory = useCallback(
    (type: "type" | "draw" | "email", settings: any, preview: string) => {
      const historyItem: SignatureHistory = {
        id: Date.now().toString(),
        name: type === "email" ? emailData.name : name,
        type,
        settings,
        timestamp: Date.now(),
        preview,
      }

      const newHistory = [historyItem, ...signatureHistory.slice(0, 9)] // 保留最近10个
      setSignatureHistory(newHistory)
      localStorage.setItem("signature-history", JSON.stringify(newHistory))
    },
    [signatureHistory, name, emailData.name],
  )

  // 应用模板
  const applyTemplate = useCallback((template: (typeof SIGNATURE_TEMPLATES)[0]) => {
    const { settings } = template
    setSelectedFont(settings.fontIndex)
    setFontSize([settings.fontSize])
    setColor(settings.color)
    setIsItalic(settings.isItalic)
    setIsBold(settings.isBold)
    setIsUnderlined(settings.isUnderlined)
    setRotation([settings.rotation])
    setLetterSpacing([settings.letterSpacing])
  }, [])

  // Memoized filtered fonts for better performance
  const filteredFonts = useMemo(() => {
    return SIGNATURE_FONTS.filter((font) => selectedCategory === "all" || font.category === selectedCategory)
  }, [selectedCategory])

  // Save canvas state for undo functionality
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setCanvasHistory((prev) => [...prev.slice(-9), imageData]) // Keep last 10 states
  }, [])

  // Undo last drawing action
  const undoCanvas = useCallback(() => {
    if (canvasHistory.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const lastState = canvasHistory[canvasHistory.length - 1]
    ctx.putImageData(lastState, 0, 0)
    setCanvasHistory((prev) => prev.slice(0, -1))
  }, [canvasHistory])

  // 实时预览更新
  useEffect(() => {
    if (activeTab === "type" && name.trim()) {
      updatePreview()
    }
  }, [activeTab, name, selectedFont, fontSize, color, isItalic, isBold, isUnderlined, rotation, letterSpacing])

  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current
    if (!canvas || !name.trim()) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置高分辨率
    const scale = 2
    canvas.width = 600 * scale
    canvas.height = 200 * scale
    ctx.scale(scale, scale)

    // 清除画布
    ctx.clearRect(0, 0, 600, 200)

    // 设置字体和样式
    const font = SIGNATURE_FONTS[selectedFont]
    const fontFamily = font.style.split(",")[0].replace(/['"]/g, "")
    let fontStyle = ""
    if (isBold) fontStyle += "bold "
    if (isItalic) fontStyle += "italic "

    ctx.font = `${fontStyle}${fontSize[0]}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // 应用旋转
    ctx.save()
    ctx.translate(300, 100)
    ctx.rotate((rotation[0] * Math.PI) / 180)

    // 添加文字阴影
    ctx.shadowColor = "rgba(0,0,0,0.1)"
    ctx.shadowBlur = 2
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1

    // 应用字母间距
    if (letterSpacing[0] !== 0) {
      const letters = name.split("")
      let totalWidth = 0
      letters.forEach((letter) => {
        totalWidth += ctx.measureText(letter).width + letterSpacing[0]
      })

      let x = -totalWidth / 2
      letters.forEach((letter) => {
        ctx.fillText(letter, x, 0)
        x += ctx.measureText(letter).width + letterSpacing[0]
      })
    } else {
      ctx.fillText(name, 0, 0)
    }

    ctx.restore()

    // 添加下划线
    if (isUnderlined) {
      const textWidth = ctx.measureText(name).width
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.moveTo(300 - textWidth / 2, 130)
      ctx.lineTo(300 + textWidth / 2, 130)
      ctx.stroke()
    }
  }, [name, selectedFont, fontSize, color, isItalic, isBold, isUnderlined, rotation, letterSpacing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on device
    const scale = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * scale
    canvas.height = rect.height * scale

    ctx.scale(scale, scale)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Set white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale)

    // Save initial state
    saveCanvasState()
  }, [saveCanvasState])

  const getEventPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1))
    const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1))

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }
  }, [])

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      saveCanvasState()
      const canvas = canvasRef.current
      if (!canvas) return

      const pos = getEventPos(e)
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      setIsDrawing(true)
    },
    [getEventPos, saveCanvasState],
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const pos = getEventPos(e)
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.lineWidth = strokeWidth[0]
      ctx.strokeStyle = color
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    },
    [isDrawing, getEventPos, strokeWidth, color],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scale = window.devicePixelRatio || 1
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale)
    setCanvasHistory([])
  }, [])

  // Create signature canvas for specific font
  const createSignatureCanvas = useCallback(
    (fontIndex: number) => {
      if (!name.trim()) return null

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      // Set high resolution for better quality
      const scale = 3
      canvas.width = 800 * scale
      canvas.height = 200 * scale
      ctx.scale(scale, scale)

      // Set transparent background
      ctx.clearRect(0, 0, 800, 200)

      // Set font and style
      const font = SIGNATURE_FONTS[fontIndex]
      const fontFamily = font.style.split(",")[0].replace(/['"]/g, "")
      let fontStyle = ""
      if (isBold) fontStyle += "bold "
      if (isItalic) fontStyle += "italic "

      ctx.font = `${fontStyle}${fontSize[0]}px ${fontFamily}`
      ctx.fillStyle = color
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Apply rotation
      ctx.save()
      ctx.translate(400, 100)
      ctx.rotate((rotation[0] * Math.PI) / 180)

      // Add text shadow for better quality
      ctx.shadowColor = "rgba(0,0,0,0.1)"
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Apply letter spacing
      if (letterSpacing[0] !== 0) {
        const letters = name.split("")
        let totalWidth = 0
        letters.forEach((letter) => {
          totalWidth += ctx.measureText(letter).width + letterSpacing[0]
        })

        let x = -totalWidth / 2
        letters.forEach((letter) => {
          ctx.fillText(letter, x, 0)
          x += ctx.measureText(letter).width + letterSpacing[0]
        })
      } else {
        ctx.fillText(name, 0, 0)
      }

      ctx.restore()

      // Add underline if selected
      if (isUnderlined) {
        const textWidth = ctx.measureText(name).width
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.moveTo(400 - textWidth / 2, 130)
        ctx.lineTo(400 + textWidth / 2, 130)
        ctx.stroke()
      }

      return canvas
    },
    [name, fontSize, color, isBold, isItalic, rotation, letterSpacing, isUnderlined],
  )

  // 创建SVG格式
  const createSignatureSVG = useCallback(
    (fontIndex: number) => {
      if (!name.trim()) return null

      const font = SIGNATURE_FONTS[fontIndex]
      const fontFamily = font.style.split(",")[0].replace(/['"]/g, "")

      let fontStyle = ""
      if (isBold) fontStyle += "font-weight: bold; "
      if (isItalic) fontStyle += "font-style: italic; "

      const textDecoration = isUnderlined ? "text-decoration: underline;" : ""

      const svg = `
      <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <text 
          x="400" 
          y="100" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fontFamily="${fontFamily}"
          fontSize="${fontSize[0]}"
          fill="${color}"
          transform="rotate(${rotation[0]} 400 100)"
          letterSpacing="${letterSpacing[0]}px"
          style="${fontStyle}${textDecoration}"
        >${name}</text>
      </svg>
    `

      return svg
    },
    [name, fontSize, color, isBold, isItalic, isUnderlined, rotation, letterSpacing],
  )

  const downloadSignatureFont = useCallback(
    (fontIndex: number) => {
      if (!name.trim()) {
        alert("Bitte geben Sie Ihren Namen ein, bevor Sie die Unterschrift herunterladen.")
        return
      }

      const font = SIGNATURE_FONTS[fontIndex]
      const fileName = `unterschrift-${name.toLowerCase().replace(/\s+/g, "-")}-${font.name.toLowerCase().replace(/\s+/g, "-")}`

      if (exportFormat === "svg") {
        const svg = createSignatureSVG(fontIndex)
        if (!svg) return

        const blob = new Blob([svg], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = `${fileName}.svg`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        const canvas = createSignatureCanvas(fontIndex)
        if (!canvas) return

        canvas.toBlob((blob) => {
          if (!blob) return

          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = `${fileName}.png`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, "image/png")
      }

      // 保存到历史记录
      const canvas = createSignatureCanvas(fontIndex)
      if (canvas) {
        const preview = canvas.toDataURL()
        saveToHistory(
          "type",
          {
            fontIndex,
            fontSize: fontSize[0],
            color,
            isItalic,
            isBold,
            isUnderlined,
            rotation: rotation[0],
            letterSpacing: letterSpacing[0],
          },
          preview,
        )
      }
    },
    [
      createSignatureCanvas,
      createSignatureSVG,
      name,
      exportFormat,
      fontSize,
      color,
      isItalic,
      isBold,
      isUnderlined,
      rotation,
      letterSpacing,
      saveToHistory,
    ],
  )

  const copySignatureToClipboard = useCallback(
    async (fontIndex: number) => {
      if (!name.trim()) {
        alert("Bitte geben Sie Ihren Namen ein, bevor Sie die Unterschrift kopieren.")
        return
      }

      try {
        // Create canvas with signature
        const canvas = createSignatureCanvas(fontIndex)
        if (!canvas) {
          alert("Fehler beim Erstellen der Unterschrift.")
          return
        }

        // Convert canvas to blob
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/png", 1.0)
        })

        if (!blob) {
          alert("Fehler beim Erstellen der Unterschrift.")
          return
        }

        // Check if clipboard API is available
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            // Copy image to clipboard
            const clipboardItem = new ClipboardItem({
              "image/png": blob,
            })

            await navigator.clipboard.write([clipboardItem])
            showSuccessMessage("Unterschrift-Bild wurde erfolgreich kopiert!")
            return
          } catch (clipboardError) {
            console.error("Image clipboard failed:", clipboardError)
          }
        }

        // Fallback: create download link if clipboard fails
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        const font = SIGNATURE_FONTS[fontIndex]
        link.download = `unterschrift-${name.toLowerCase().replace(/\s+/g, "-")}-${font.name.toLowerCase().replace(/\s+/g, "-")}.png`
        link.href = url
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        showSuccessMessage("Kopieren nicht unterstützt - Datei wurde heruntergeladen!")
      } catch (error) {
        console.error("Copy operation failed:", error)
        alert("Kopieren fehlgeschlagen. Bitte versuchen Sie es erneut.")
      }
    },
    [name, createSignatureCanvas],
  )

  const downloadCanvasSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check if canvas has content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const hasContent = imageData.data.some((channel, index) => index % 4 === 3 && channel !== 0)

    if (!hasContent) {
      alert("Bitte zeichnen Sie zuerst Ihre Unterschrift.")
      return
    }

    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `handgezeichnete-unterschrift-${new Date().getTime()}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // 保存到历史记录
      const preview = canvas.toDataURL()
      saveToHistory("draw", { strokeWidth: strokeWidth[0], color }, preview)
    }, "image/png")
  }, [strokeWidth, color, saveToHistory])

  const downloadEmailSignature = useCallback(() => {
    if (!emailData.name.trim()) {
      alert("Bitte geben Sie mindestens Ihren Namen ein.")
      return
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>E-Mail Signatur</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333;">
        <div style="border-left: 4px solid #3B82F6; padding-left: 15px;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 2px;">${emailData.name}</div>
            ${emailData.position ? `<div style="color: #666; margin-bottom: 2px;">${emailData.position}</div>` : ""}
            ${emailData.company ? `<div style="font-weight: 500; margin-bottom: 8px;">${emailData.company}</div>` : ""}
            <div style="font-size: 12px; color: #666;">
                ${emailData.phone ? `<div style="margin-bottom: 2px;">📞 ${emailData.phone}</div>` : ""}
                ${emailData.email ? `<div style="margin-bottom: 2px;">✉️ ${emailData.email}</div>` : ""}
                ${emailData.website ? `<div>🌐 <a href="http://${emailData.website}" style="color: #3B82F6; text-decoration: none;">${emailData.website}</a></div>` : ""}
            </div>
        </div>
    </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `email-signatur-${emailData.name.toLowerCase().replace(/\s+/g, "-")}.html`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Also copy to clipboard
    const textContent = `${emailData.name}${emailData.position ? `\n${emailData.position}` : ""}${emailData.company ? `\n${emailData.company}` : ""}${emailData.phone ? `\n📞 ${emailData.phone}` : ""}${emailData.email ? `\n✉️ ${emailData.email}` : ""}${emailData.website ? `\n🌐 ${emailData.website}` : ""}`

    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        alert("E-Mail-Signatur wurde heruntergeladen und in die Zwischenablage kopiert!")
      })
      .catch(() => {
        alert("E-Mail-Signatur wurde erfolgreich heruntergeladen!")
      })

    // 保存到历史记录
    saveToHistory(
      "email",
      emailData,
      "data:image/svg+xml;base64," +
        btoa(
          `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><text x="10" y="30" fontFamily="Arial" fontSize="14" fill="#333">${emailData.name}</text></svg>`,
        ),
    )
  }, [emailData, saveToHistory])

  const downloadSignature = useCallback(() => {
    if (activeTab === "type") {
      downloadSignatureFont(selectedFont)
    } else if (activeTab === "draw") {
      downloadCanvasSignature()
    } else if (activeTab === "email") {
      downloadEmailSignature()
    }
  }, [activeTab, downloadSignatureFont, selectedFont, downloadCanvasSignature, downloadEmailSignature])

  const categories = ["all", "elegant", "classic", "modern", "business", "artistic", "luxury"]

  // Touch handlers with better performance
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      saveCanvasState()
      const canvas = canvasRef.current
      if (!canvas) return

      const pos = getEventPos(e)
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      setIsDrawing(true)
    },
    [getEventPos, saveCanvasState],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const pos = getEventPos(e)
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.lineWidth = strokeWidth[0]
      ctx.strokeStyle = color
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    },
    [isDrawing, getEventPos, strokeWidth, color],
  )

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(false)
  }, [])

  // Helper function to show success message
  const showSuccessMessage = useCallback((message: string) => {
    const successMsg = document.createElement("div")
    successMsg.innerHTML = `✅ ${message}`
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `

    // Add animation keyframes if not already present
    if (!document.querySelector("#copy-animation-styles")) {
      const style = document.createElement("style")
      style.id = "copy-animation-styles"
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(successMsg)

    // Remove message after 3 seconds
    setTimeout(() => {
      successMsg.style.animation = "slideOut 0.3s ease-in"
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg)
        }
      }, 300)
    }, 3000)
  }, [])

  return (
    <section id="signature-generator" className="py-8 sm:py-12 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <Badge className="mb-3 sm:mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm">
            🚀 Professioneller Unterschrift Generator
          </Badge>
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4">
            Ihr Unterschriften-Generator
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Wählen Sie zwischen drei verschiedenen Methoden, um Ihre perfekte Unterschrift zu erstellen
          </p>

          {/* 用户引导和帮助按钮 */}
          <div className="flex justify-center gap-2 mt-4">
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Hilfe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Willkommen beim Unterschrift Generator!
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Type className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tippen</h4>
                      <p className="text-gray-600">
                        Geben Sie Ihren Namen ein und wählen Sie aus 24 professionellen Schriftarten
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PenTool className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Zeichnen</h4>
                      <p className="text-gray-600">Zeichnen Sie Ihre Unterschrift direkt mit Maus oder Touchscreen</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">E-Mail Signatur</h4>
                      <p className="text-gray-600">
                        Erstellen Sie eine professionelle E-Mail-Signatur mit Ihren Kontaktdaten
                      </p>
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>
                      💡 <strong>Tipp:</strong> Alle Daten werden nur lokal verarbeitet - Ihre Privatsphäre ist
                      geschützt!
                    </AlertDescription>
                  </Alert>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                  <History className="w-4 h-4 mr-1" />
                  Verlauf ({signatureHistory.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Unterschriften-Verlauf</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {signatureHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Noch keine Unterschriften erstellt</p>
                  ) : (
                    signatureHistory.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <img
                          src={item.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-8 object-contain border rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.type === "type" ? "Getippt" : item.type === "draw" ? "Gezeichnet" : "E-Mail"} •
                            {new Date(item.timestamp).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (item.type === "type") {
                              setActiveTab("type")
                              setName(item.name)
                              const settings = item.settings
                              setSelectedFont(settings.fontIndex)
                              setFontSize([settings.fontSize])
                              setColor(settings.color)
                              setIsItalic(settings.isItalic)
                              setIsBold(settings.isBold)
                              setIsUnderlined(settings.isUnderlined)
                              setRotation([settings.rotation])
                              setLetterSpacing([settings.letterSpacing])
                            }
                            setShowHistory(false)
                          }}
                        >
                          Laden
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 字体加载状态 */}
        {!fontsLoaded && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Schriftarten werden geladen...
            </div>
          </div>
        )}

        <Card className="max-w-6xl mx-auto shadow-lg">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto gap-1">
                <TabsTrigger
                  value="type"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm px-2"
                >
                  <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Tippen</span>
                </TabsTrigger>
                <TabsTrigger
                  value="draw"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm px-2"
                >
                  <PenTool className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Zeichnen</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm px-2"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>E-Mail</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
            <Tabs value={activeTab} className="w-full">
              {/* Type Tab */}
              <TabsContent value="type" className="space-y-4 sm:space-y-6">
                {/* 实时预览区域 */}
                {name.trim() && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-600" />
                          Live-Vorschau
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {SIGNATURE_FONTS[selectedFont].name}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-white rounded-lg p-6 border-2 border-dashed border-blue-200 text-center">
                        <canvas
                          ref={previewCanvasRef}
                          width={600}
                          height={200}
                          className="max-w-full h-auto"
                          style={{ maxHeight: "150px" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 签名模板 */}
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Schnell-Vorlagen
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {SIGNATURE_TEMPLATES.map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => applyTemplate(template)}
                          className="text-xs p-2 h-auto flex flex-col gap-1"
                        >
                          <span className="font-medium">{template.name}</span>
                          <span className="text-xs text-gray-500">Anwenden</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">
                      Ihr Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Max Mustermann"
                      className="text-base sm:text-lg mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-sm">Größe: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        max={isMobile ? 60 : 80}
                        min={20}
                        step={2}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Rotation: {rotation[0]}°</Label>
                      <Slider
                        value={rotation}
                        onValueChange={setRotation}
                        max={15}
                        min={-15}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Label className="text-sm">Buchstabenabstand: {letterSpacing[0]}px</Label>
                      <Slider
                        value={letterSpacing}
                        onValueChange={setLetterSpacing}
                        max={10}
                        min={-2}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base">Farbe wählen</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {PRESET_COLORS.map((presetColor) => (
                        <button
                          key={presetColor.value}
                          onClick={() => setColor(presetColor.value)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                            color === presetColor.value ? "border-gray-800 scale-110" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: presetColor.value }}
                          title={presetColor.name}
                        />
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded border cursor-pointer"
                          title="Benutzerdefinierte Farbe"
                        />
                        <span className="text-xs sm:text-sm text-gray-600">{color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="bold" checked={isBold} onCheckedChange={setIsBold} />
                      <Label htmlFor="bold" className="text-xs sm:text-sm">
                        Fett
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="italic" checked={isItalic} onCheckedChange={setIsItalic} />
                      <Label htmlFor="italic" className="text-xs sm:text-sm">
                        Kursiv
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="underline" checked={isUnderlined} onCheckedChange={setIsUnderlined} />
                      <Label htmlFor="underline" className="text-xs sm:text-sm">
                        Unterstrichen
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Font Category Filter */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs px-2 py-1 h-7 sm:h-8"
                    >
                      {category === "all" ? "Alle" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Font Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  {filteredFonts.map((font, index) => {
                    const originalIndex = SIGNATURE_FONTS.findIndex((f) => f.name === font.name)
                    return (
                      <div
                        key={font.name}
                        className={`p-2 sm:p-3 lg:p-4 border-2 rounded-lg transition-all ${
                          selectedFont === originalIndex
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1 capitalize">{font.category}</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 truncate">{font.name}</p>
                          <div
                            className="cursor-pointer mb-2 sm:mb-3 min-h-[25px] sm:min-h-[35px] flex items-center justify-center overflow-hidden"
                            onClick={() => setSelectedFont(originalIndex)}
                            style={{
                              fontFamily: font.style,
                              fontSize: `${Math.min(fontSize[0] * (isMobile ? 0.5 : 0.7), isMobile ? 20 : 28)}px`,
                              color: color,
                              fontStyle: isItalic ? "italic" : "normal",
                              textDecoration: isUnderlined ? "underline" : "none",
                              fontWeight: isBold ? "bold" : "normal",
                              transform: `rotate(${rotation[0]}deg)`,
                              letterSpacing: `${letterSpacing[0]}px`,
                              opacity: fontsLoaded ? 1 : 0.5,
                            }}
                          >
                            <span className="truncate max-w-full">{name || "Max Mustermann"}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={selectedFont === originalIndex ? "default" : "outline"}
                              onClick={() => setSelectedFont(originalIndex)}
                              className="flex-1 text-xs px-1 py-1 h-7"
                            >
                              Wählen
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => copySignatureToClipboard(originalIndex)}
                              className="px-1 py-1 h-7 w-7"
                              disabled={!name.trim()}
                              title="Bild kopieren"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => downloadSignatureFont(originalIndex)}
                              className="px-1 py-1 h-7 w-7"
                              disabled={!name.trim()}
                              title="Herunterladen"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Draw Tab */}
              <TabsContent value="draw" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm">Strichstärke: {strokeWidth[0]}px</Label>
                    <Slider
                      value={strokeWidth}
                      onValueChange={setStrokeWidth}
                      max={15}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Farbe</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-8 sm:w-12 sm:h-10 rounded border cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm text-gray-600">{color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={undoCanvas}
                      disabled={canvasHistory.length === 0}
                      className="text-xs bg-transparent"
                    >
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Rückgängig
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearCanvas} className="text-xs bg-transparent">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Löschen
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4 bg-white">
                    <canvas
                      ref={canvasRef}
                      width={isMobile ? 600 : 800}
                      height={isMobile ? 225 : 300}
                      className="w-full border rounded cursor-crosshair bg-white touch-none max-w-full"
                      style={{
                        height: "auto",
                        aspectRatio: "8/3",
                        maxHeight: isMobile ? "200px" : "300px",
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
                      Zeichnen Sie Ihre Unterschrift mit der Maus oder dem Touchscreen
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="email-name" className="text-sm">
                        Name *
                      </Label>
                      <Input
                        id="email-name"
                        value={emailData.name}
                        onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
                        placeholder="Max Mustermann"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position" className="text-sm">
                        Position
                      </Label>
                      <Input
                        id="position"
                        value={emailData.position}
                        onChange={(e) => setEmailData({ ...emailData, position: e.target.value })}
                        placeholder="Geschäftsführer"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="company" className="text-sm">
                        Unternehmen
                      </Label>
                      <Input
                        id="company"
                        value={emailData.company}
                        onChange={(e) => setEmailData({ ...emailData, company: e.target.value })}
                        placeholder="Muster GmbH"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        value={emailData.phone}
                        onChange={(e) => setEmailData({ ...emailData, phone: e.target.value })}
                        placeholder="+49 123 456789"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="email-address" className="text-sm">
                        E-Mail
                      </Label>
                      <Input
                        id="email-address"
                        type="email"
                        value={emailData.email}
                        onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                        placeholder="max@beispiel.de"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website" className="text-sm">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={emailData.website}
                        onChange={(e) => setEmailData({ ...emailData, website: e.target.value })}
                        placeholder="www.beispiel.de"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Email Signature Preview */}
                <div className="border rounded-lg p-3 sm:p-4 bg-white">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4" />
                    Vorschau Ihrer E-Mail-Signatur:
                  </h4>
                  <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-800 text-base sm:text-lg">
                      {emailData.name || "Max Mustermann"}
                    </div>
                    {emailData.position && <div className="text-gray-600 text-sm">{emailData.position}</div>}
                    {emailData.company && <div className="font-medium text-gray-800 mt-1">{emailData.company}</div>}
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      {emailData.phone && <div>📞 {emailData.phone}</div>}
                      {emailData.email && <div>✉️ {emailData.email}</div>}
                      {emailData.website && (
                        <div>
                          🌐 <span className="text-blue-600">{emailData.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Export Format Selection */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Label className="text-sm font-medium">Export-Format:</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      PNG
                    </div>
                  </SelectItem>
                  <SelectItem value="svg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      SVG
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download Button */}
            <div className="text-center pt-4 sm:pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <Button
                  size={isMobile ? "default" : "lg"}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 w-full sm:w-auto"
                  onClick={downloadSignature}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Unterschrift herunterladen
                </Button>
                {activeTab === "type" && name.trim() && (
                  <Button
                    size={isMobile ? "default" : "lg"}
                    variant="outline"
                    onClick={() => copySignatureToClipboard(selectedFont)}
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Bild kopieren
                  </Button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 px-2">
                {activeTab === "email"
                  ? "Als HTML-Datei und in Zwischenablage"
                  : `Als ${exportFormat.toUpperCase()}-Datei${exportFormat === "png" ? " (transparent)" : ""}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
