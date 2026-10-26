import { useState } from 'react'
import type { GenerationState } from '../types'

export function useGenerationState() {
  const [isLoadingState, setIsLoadingState] = useState(true)

  const saveStateToStore = async (state: GenerationState) => {
    try {
      await fetch('/api/generation-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
    } catch (error) {
      console.error('Failed to save state to Cloudflare KV:', error)
    }
  }

  const loadStateFromStore = async (): Promise<GenerationState | null> => {
    try {
      const response = await fetch('/api/generation-state')
      if (!response.ok) return null
      const data = (await response.json()) as { state: GenerationState | null }
      return data.state
    } catch (error) {
      console.error('Failed to load state from Cloudflare KV:', error)
      return null
    }
  }

  const clearStateFromStore = async () => {
    try {
      await fetch('/api/generation-state', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear state from Cloudflare KV:', error)
    }
  }

  return {
    isLoadingState,
    setIsLoadingState,
    saveStateToStore,
    loadStateFromStore,
    clearStateFromStore,
  }
}
