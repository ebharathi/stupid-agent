'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // Create drops
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * fontSize
    }

    // Colors
    const colors = [
      '#10B981', // Green
      '#7C3AED', // Purple
      '#F59E0B', // Orange
      '#EF4444', // Red
      '#3B82F6', // Blue
    ]

    let animationFrameId: number

    function draw() {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)]
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        // Draw character
        ctx.fillStyle = color
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`
        ctx.fillText(char, i * fontSize, drops[i])
        
        // Move drop down
        drops[i] += fontSize
        
        // Reset drop if it goes off screen
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-5 opacity-20 pointer-events-none"
    />
  )
}