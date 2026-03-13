'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface RotatingLoaderTextProps {
  messages: string[]
  interval?: number
  className?: string
}

export function RotatingLoaderText({
  messages,
  interval = 3000,
  className = '',
}: RotatingLoaderTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [messages.length, interval])

  return (
    <div className={`relative h-10 min-w-[300px] overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm font-medium text-blue-700"
        >
          {messages[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
