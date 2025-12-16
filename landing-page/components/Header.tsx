'use client'

import { Terminal, Menu, X, Github, Code, Skull, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'DEMO', href: '#demo', icon: Zap },
    { label: 'FEATURES', href: '#features', icon: Code },
    { label: 'GITHUB', href: 'https://github.com/ebharathi/devil.ai', icon: Github },
  ]

  return (
    <motion.header 
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-dark/95 backdrop-blur-xl border-gray-800/50 shadow-2xl' 
          : 'bg-dark/80 backdrop-blur-lg border-dark-light/20'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - INSANE VERSION */}
          <motion.div 
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="relative">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 group-hover:border-primary/40 transition-colors glow">
                <Terminal className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text tracking-tight">DEVIL.AI</span>
              <div className="flex items-center space-x-2">
                <Skull className="w-3 h-3 text-red-500" />
                <span className="text-xs text-gray-400 font-mono tracking-wider">NO RESTRICTIONS</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation - CYBER STYLE */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="group relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-bold tracking-wider"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  {/* Hover underline effect */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 -z-10"></div>
                </motion.a>
              )
            })}
            
            {/* GitHub Button - INSANE */}
            <motion.a 
              href="https://github.com/ebharathi/devil.ai"
              className="group relative px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 overflow-hidden glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="flex items-center space-x-2 relative z-10">
                <Github className="w-5 h-5" />
                <span>STAR ON GITHUB</span>
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </motion.a>
          </nav>

          {/* Mobile Menu Button - CYBER */}
          <motion.button
            className="md:hidden p-3 bg-dark-light/30 hover:bg-dark-light/50 rounded-xl border border-gray-800 transition-colors relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-gray-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-gray-300" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></div>
          </motion.button>
        </div>

        {/* Mobile Navigation - INSANE */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 pb-4 border-t border-gray-800/50 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white bg-dark-light/30 hover:bg-dark-light/50 rounded-xl border border-gray-800 transition-all duration-200"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                      whileHover={{ x: 5 }}
                    >
                      <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                      <span className="font-bold tracking-wider">{item.label}</span>
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.a>
                  )
                })}
                
                {/* GitHub Button Mobile */}
                <motion.a 
                  href="https://github.com/ebharathi/devil.ai"
                  className="group px-4 py-4 bg-primary hover:bg-primary-dark rounded-xl font-bold transition-all duration-200 text-center relative overflow-hidden glow"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsMenuOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <Github className="w-5 h-5" />
                    <span>STAR ON GITHUB</span>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan line effect for header */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
    </motion.header>
  )
}