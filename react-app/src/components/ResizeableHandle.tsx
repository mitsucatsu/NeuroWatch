"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

type ResizableHandleProps = {
  onResize: (newWidth: number) => void
  initialWidth: number
}

export function ResizableHandle({ onResize, initialWidth }: ResizableHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(initialWidth)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startXRef.current
      const newWidth = startWidthRef.current + deltaX
      onResize(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onResize])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    startXRef.current = e.clientX
    startWidthRef.current = initialWidth
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  return <div className={`resize-handle h-full ${isDragging ? "active" : ""}`} onMouseDown={handleMouseDown} />
}

