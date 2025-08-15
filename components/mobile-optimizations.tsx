"use client"

import { useEffect } from "react"

export function MobileOptimizations() {
  useEffect(() => {
    // Prevent zoom on input focus for iOS
    const addMaximumScaleToMetaViewport = () => {
      const el = document.querySelector("meta[name=viewport]")
      if (el !== null) {
        let content = el.getAttribute("content")
        const re = /maximum-scale=[0-9.]+/g
        if (re.test(content)) {
          content = content.replace(re, "maximum-scale=1.0")
        } else {
          content = [content, "maximum-scale=1.0"].join(", ")
        }
        el.setAttribute("content", content)
      }
    }

    const disableIosTextFieldZoom = addMaximumScaleToMetaViewport

    // Disable zoom on input focus
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea')
    inputs.forEach((input) => {
      input.addEventListener("focus", disableIosTextFieldZoom, false)
      input.addEventListener(
        "blur",
        () => {
          const el = document.querySelector("meta[name=viewport]")
          if (el !== null) {
            let content = el.getAttribute("content")
            content = content.replace(/maximum-scale=[0-9.]+/g, "maximum-scale=5.0")
            el.setAttribute("content", content)
          }
        },
        false,
      )
    })

    // Prevent pull-to-refresh
    let startY = 0
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const clientY = e.touches[0].clientY
      if (e.type === "touchstart") {
        startY = clientY
      }
      if (e.type === "touchmove") {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop === 0 && clientY > startY) {
          e.preventDefault()
        }
      }
    }

    document.addEventListener("touchstart", preventPullToRefresh, { passive: false })
    document.addEventListener("touchmove", preventPullToRefresh, { passive: false })

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", preventPullToRefresh)
      document.removeEventListener("touchmove", preventPullToRefresh)
    }
  }, [])

  return null
}
