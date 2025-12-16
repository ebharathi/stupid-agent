'use client'

import { useState, useEffect } from 'react'
import { Terminal, X, Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const commands = [
  { cmd: 'whoami', output: 'devil@ai-agent:~$ root' },
  { cmd: 'pwd', output: '/home/devil/Documents/projects/stupid-ideas/ghost' },
  { cmd: 'ls -la', output: 'total 304K\ndrwxrwxr-x  7 devil devil 4.0K Dec 16 18:32 .\ndrwxrwxr-x  7 devil devil 4.0K Dec 16 16:28 ..\ndrwxrwxr-x  2 devil devil 4.0K Dec 16 18:39 app\ndrwxrwxr-x  2 devil devil 4.0K Dec 16 18:39 components\n-rw-rw-r--  1 devil devil 1.4K Dec 16 16:42 Dockerfile' },
  { cmd: 'systemctl status devil-agent', output: '● devil-agent.service - Devil AI Agent\n   Loaded: loaded (/etc/systemd/system/devil-agent.service; enabled; vendor preset: enabled)\n   Active: active (running) since Mon 2024-12-16 18:32:45 UTC; 2h ago\n   Main PID: 1337 (devil-agent)\n   CGroup: /system.slice/devil-agent.service\n           └─1337 /usr/bin/devil-agent --no-restrictions' },
  { cmd: 'cat /proc/cpuinfo | grep "model name"', output: 'model name\t: Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz\nmodel name\t: Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz\nmodel name\t: Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz\nmodel name\t: Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz' },
  { cmd: 'free -h', output: '              total        used        free      shared  buff/cache   available\nMem:           62G        8.2G         48G        1.2G        5.8G         52G\nSwap:           0B          0B          0B' },
  { cmd: 'ps aux | grep -i ai', output: 'devil     1337  0.5  2.1 12345678 987654 ?    Ssl  18:32   0:45 /usr/bin/devil-agent --no-restrictions\nroot      2468  0.1  0.5  1234567 123456 ?    S    18:33   0:12 python3 /opt/ai-supervisor.py' },
]

export default function TerminalWindow() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const [currentCommand, setCurrentCommand] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    const command = commands[currentCommand]
    let index = 0
    let isDeleting = false

    const typeWriter = () => {
      if (!isDeleting) {
        // Typing command
        if (index <= command.cmd.length) {
          setDisplayText(command.cmd.substring(0, index))
          index++
          setTimeout(typeWriter, 50)
        } else {
          // Wait, then show output
          setTimeout(() => {
            setDisplayText(`${command.cmd}\n${command.output}`)
            setTimeout(() => {
              isDeleting = true
              index = command.cmd.length + command.output.length + 1
              typeWriter()
            }, 2000)
          }, 500)
        }
      } else {
        // Deleting
        if (index > 0) {
          const fullText = `${command.cmd}\n${command.output}`
          setDisplayText(fullText.substring(0, index - 1))
          index--
          setTimeout(typeWriter, 20)
        } else {
          // Move to next command
          isDeleting = false
          setCurrentCommand((prev) => (prev + 1) % commands.length)
          setTimeout(typeWriter, 500)
        }
      }
    }

    const timer = setTimeout(typeWriter, 1000)

    return () => clearTimeout(timer)
  }, [currentCommand, isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed ${
            isMaximized 
              ? 'ins-0 m-4 md:m-8' 
              : 'bottom-8 right-8 w-96 h-64'
          } bg-dark/95 backdrop-blur-xl rounded-xl border border-gray-800 shadow-2xl z-50 overflow-hidden`}
          style={{
            boxShadow: '0 0 60px rgba(124, 58, 237, 0.3), 0 0 100px rgba(16, 185, 129, 0.2)',
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-dark-light/50 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-500" />
              <span className="text-sm font-mono text-gray-300">devil@ai-agent:~</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                {isMaximized ? (
                  <Minimize2 className="w-3 h-3 text-gray-400" />
                ) : (
                  <Maximize2 className="w-3 h-3 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-4 h-[calc(100%-3rem)] overflow-auto">
            <div className="font-mono text-sm">
              <div className="text-green-500 mb-2">
                devil@ai-agent:~$ <span className="text-gray-100">{displayText}</span>
                <span className="ml-1 animate-pulse bg-green-500 w-2 h-4 inline-block"></span>
              </div>
              
              {/* Welcome message */}
              {!displayText && (
                <div className="text-gray-400">
                  <div className="mb-2">╔══════════════════════════════════════╗</div>
                  <div className="mb-2">║  Devil AI Agent - Live Terminal     ║</div>
                  <div className="mb-2">║  No Restrictions • Full Access      ║</div>
                  <div className="mb-2">╚══════════════════════════════════════╝</div>
                  <div className="mt-4 text-xs">
                    <div className="text-green-500">● System: Active</div>
                    <div className="text-blue-500">● Access: Root</div>
                    <div className="text-purple-500">● Restrictions: None</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal footer */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-dark-light/30 border-t border-gray-800 text-xs text-gray-500 font-mono">
            <div className="flex justify-between">
              <span>PID: 1337</span>
              <span>CPU: 8.2%</span>
              <span>MEM: 2.1G</span>
              <span>UPTIME: 2h 45m</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Open terminal button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 p-4 bg-primary hover:bg-primary-dark rounded-full shadow-2xl z-40 group transition-all duration-200 hover:scale-110"
          style={{
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.5)',
          }}
        >
          <Terminal className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}