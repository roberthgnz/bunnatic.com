'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

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
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (messages.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, interval)

    return () => clearInterval(timer)
  }, [messages.length, interval])

  const offset = reduceMotion ? 0 : 6

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('relative h-6 w-full max-w-sm overflow-hidden', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -offset }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-muted-foreground absolute inset-0 flex items-center justify-center text-center text-sm"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
