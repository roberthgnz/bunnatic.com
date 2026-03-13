'use client'

import { createContext, useContext } from 'react'

// Define types based on usage
export type Business = {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  // Add other fields as they are encountered
  [key: string]: any
}

export type Service = {
  id: string
  name: string
  description: string | null
  price: number | null
  duration: number | null
  [key: string]: any
}

export type WorkingHour = {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
  [key: string]: any
}

export type Section = {
  id: string
  status: 'draft' | 'review' | 'published'
  [key: string]: any
}

export type BusinessDomain = {
  hostname: string
  status: string
} | null

type BusinessContextType = {
  business: Business
  services: Service[]
  workingHours: WorkingHour[]
  sections: Section[]
  businessDomain: BusinessDomain
  // Computed values
  setupChecklist: boolean[]
  setupCompletedCount: number
  setupCompletion: number
  setupStatus: 'complete' | 'inProgress' | 'early'
}

const BusinessContext = createContext<BusinessContextType | null>(null)

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}

export function BusinessProvider({
  children,
  business,
  services,
  workingHours,
  sections,
  businessDomain,
}: {
  children: React.ReactNode
  business: Business
  services: Service[]
  workingHours: WorkingHour[]
  sections: Section[]
  businessDomain: BusinessDomain
}) {
  // Logic lifted from layout.tsx to be available globally
  const activeDays = workingHours.filter((hour) => !hour.is_closed).length
  const hasProfile = Boolean(
    business.name?.trim() &&
    business.category?.trim() &&
    business.description?.trim()
  )
  const hasContact =
    Boolean(business.phone?.trim()) || Boolean(business.email?.trim())
  const hasAddress = Boolean(business.address?.trim())
  const hasServices = services.length > 0
  const hasHours = activeDays > 0
  // Simplified logic, considering the essentials for minimum readiness.
  const hasPublishedContent = sections.some(
    (section) => section.status === 'published'
  )

  const setupChecklist = [
    hasProfile,
    hasContact,
    hasAddress,
    hasServices,
    hasHours,
    hasPublishedContent,
  ]
  const setupCompletedCount = setupChecklist.filter(Boolean).length
  const setupCompletion = Math.round(
    (setupCompletedCount / setupChecklist.length) * 100
  )
  const setupStatus =
    setupCompletion === 100
      ? 'complete'
      : setupCompletion >= 60
        ? 'inProgress'
        : 'early'

  const value = {
    business,
    services,
    workingHours,
    sections,
    businessDomain,
    setupChecklist,
    setupCompletedCount,
    setupCompletion,
    setupStatus,
  }

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  )
}
