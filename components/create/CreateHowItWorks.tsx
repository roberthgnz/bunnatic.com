'use client'

import { motion } from 'motion/react'
import {
  CheckCircle2,
  Globe,
  MapPin,
  MessageCircle,
  Search,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export type CreateHowItWorksCopy = {
  howToTitle: string
  howToSubtitle: string
  howToStep1: string
  howToStep2: string
  howToStep3: string
  searchPlaceholder: string
  extractedData: string
  step1: string
  step2: string
  step3: string
  optimized: string
  generatedProposal: string
}

type CreateHowItWorksProps = {
  copy: CreateHowItWorksCopy
  query: string
}

const easeOut = [0.16, 1, 0.3, 1] as const
const easeInOut = [0.4, 0, 0.2, 1] as const

const cardVariants = {
  rest: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const revealResult = {
  rest: {
    opacity: 0,
    maxHeight: '0px',
    marginTop: '0px',
  },
  hover: {
    opacity: 1,
    maxHeight: '44px',
    marginTop: '12px',
    transition: { duration: 0.3, ease: easeOut },
  },
}

const loadingReveal = {
  rest: {
    opacity: 0,
    maxHeight: '0px',
    marginTop: '0px',
  },
  hover: {
    opacity: 1,
    maxHeight: '44px',
    marginTop: '10px',
    transition: { duration: 0.35, ease: easeOut },
  },
}

const chatReveal = {
  rest: {
    opacity: 0,
    maxHeight: '0px',
    marginTop: '0px',
  },
  hover: {
    opacity: 1,
    maxHeight: '130px',
    marginTop: '12px',
    transition: { duration: 0.35, ease: easeOut },
  },
}

const progressPulse = {
  rest: { scaleX: 0.45, transformOrigin: 'left' },
  hover: {
    scaleX: 1,
    transformOrigin: 'left',
    transition: { duration: 0.55, ease: easeOut },
  },
}

export default function CreateHowItWorks({
  copy,
  query,
}: CreateHowItWorksProps) {
  const steps = [
    {
      number: '1',
      title: copy.howToStep1,
      color: 'bg-[#0b0b0b]',
      mockup: (
        <motion.div className="space-y-3" variants={cardVariants}>
          <div className="flex items-center gap-2 rounded-full border border-[#e6e6e1] bg-white px-3.5 py-2.5 text-xs text-[#6b6b66]">
            <Search className="h-4 w-4 text-black/40" />
            <span>{copy.searchPlaceholder}</span>
          </div>
          <motion.div className="overflow-hidden" variants={revealResult}>
            <div className="flex items-center gap-2 px-1 text-xs font-medium text-[#0b0b0b]">
              <MapPin className="h-4 w-4 text-[#0b0b0b]" />
              <span className="truncate">
                {query.trim() || 'Pizzería Napoli, Madrid'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
    {
      number: '2',
      title: copy.howToStep2,
      color: 'bg-[#0b0b0b]',
      mockup: (
        <motion.div className="space-y-3.5" variants={cardVariants}>
          <div className="flex items-center gap-2 border-b border-[#e6e6e1] pb-2.5 text-xs font-medium text-[#0b0b0b]">
            <Globe className="h-4 w-4 text-[#0b0b0b]" />
            {copy.extractedData}
          </div>
          <ul className="space-y-2.5 text-xs text-[#6b6b66]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0b0b0b]" />
              {copy.step1}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#0b0b0b]" />
              {copy.step2}
            </li>
            <motion.li
              className="flex items-center gap-2 overflow-hidden text-black/40"
              variants={loadingReveal}
            >
              <motion.div
                className="h-4 w-4 rounded-full border-2 border-black/15 border-t-[#0b0b0b]"
                variants={{
                  rest: { rotate: 0 },
                  hover: {
                    rotate: [0, 180, 360],
                    transition: { duration: 1, ease: easeInOut },
                  },
                }}
              />
              {copy.step3}
            </motion.li>
          </ul>
          <div className="h-1 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div
              variants={progressPulse}
              className="h-full w-full bg-[#0b0b0b]"
            />
          </div>
        </motion.div>
      ),
    },
    {
      number: '3',
      title: copy.howToStep3,
      color: 'bg-[#0b0b0b]',
      mockup: (
        <motion.div className="space-y-2.5" variants={cardVariants}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0b0b0b] px-3 py-1 text-[11px] font-medium text-white">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {copy.optimized}
          </div>
          <motion.div className="overflow-hidden" variants={chatReveal}>
            <div className="rounded-2xl border border-[#e6e6e1] bg-white p-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f3ef] text-[#0b0b0b]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <p className="text-xs leading-snug font-medium text-black/75">
                  {copy.generatedProposal}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
  ]

  return (
    <section className="mt-8 rounded-3xl bg-[#f3f3ef] p-4 sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <h4 className="text-2xl font-medium tracking-[-0.04em] text-[#0b0b0b] sm:text-3xl">
          {copy.howToTitle}
        </h4>
        <p className="mt-3 text-sm text-[#6b6b66] sm:text-base">
          {copy.howToSubtitle}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:gap-5 lg:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: easeOut }}
          >
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardVariants}
            >
              <Card className="rounded-3xl border-0 bg-white shadow-none ring-1 ring-[#e6e6e1] transition-shadow hover:ring-[#0b0b0b]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-base font-medium tracking-[-0.01em] text-[#0b0b0b]">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm text-white tabular-nums ${step.color}`}
                    >
                      {step.number}
                    </span>
                    {step.title}
                  </div>
                  <div className="mt-5 rounded-2xl bg-[#f3f3ef] p-4">
                    {step.mockup}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
