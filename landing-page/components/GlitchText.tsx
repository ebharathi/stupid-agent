'use client'

import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <div className="relative inline-block">
      {/* Main text */}
      <motion.span
        className={`relative z-10 ${className}`}
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 0.5, -0.5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.span>
      
      {/* Glitch layers */}
      <span 
        className="absolute top-0 left-0 z-0 text-red-500 opacity-70"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 65%)',
          transform: 'translate(2px, -1px)',
        }}
      >
        {text}
      </span>
      
      <span 
        className="absolute top-0 left-0 z-0 text-blue-500 opacity-70"
        style={{
          clipPath: 'polygon(0 35%, 100% 35%, 100% 100%, 0 100%)',
          transform: 'translate(-2px, 1px)',
        }}
      >
        {text}
      </span>
      
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 5,
        }}
      />
    </div>
  )
}