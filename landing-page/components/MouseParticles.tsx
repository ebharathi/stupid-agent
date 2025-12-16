'use client'

import { useEffect } from 'react'

export default function MouseParticles() {
  useEffect(() => {
    const container = document.getElementById('particle-container')
    if (!container) return

    const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6']
    
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div')
      particle.className = 'particle-trail'
      
      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)]
      particle.style.background = color
      
      // Random size
      const size = Math.random() * 6 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Random position offset
      const offsetX = (Math.random() - 0.5) * 100
      const offsetY = (Math.random() - 0.5) * 100
      
      particle.style.left = `${x + offsetX}px`
      particle.style.top = `${y + offsetY}px`
      
      // Random animation duration
      const duration = Math.random() * 2 + 1
      particle.style.animationDuration = `${duration}s`
      
      container.appendChild(particle)
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle)
        }
      }, duration * 1000)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Create particles on mouse move (throttled)
      if (Math.random() > 0.7) {
        createParticle(e.clientX, e.clientY)
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Create burst of particles on click
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          createParticle(e.clientX, e.clientY)
        }, i * 50)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return <div id="particle-container" className="fixed inset-0 pointer-events-none -z-1" />
}