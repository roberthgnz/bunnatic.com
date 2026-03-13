import { useState } from 'react'
import type { GenerationState } from '../types'

export function useGenerationState() {
    const [isLoadingState, setIsLoadingState] = useState(true)

    const saveStateToRedis = async (state: GenerationState) => {
        try {
            await fetch('/api/generation-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            })
        } catch (error) {
            console.error('Failed to save state to Redis:', error)
        }
    }

    const loadStateFromRedis = async (): Promise<GenerationState | null> => {
        try {
            const response = await fetch('/api/generation-state')
            if (!response.ok) return null
            const data = (await response.json()) as { state: GenerationState | null }
            return data.state
        } catch (error) {
            console.error('Failed to load state from Redis:', error)
            return null
        }
    }

    const clearStateFromRedis = async () => {
        try {
            await fetch('/api/generation-state', { method: 'DELETE' })
        } catch (error) {
            console.error('Failed to clear state from Redis:', error)
        }
    }

    return {
        isLoadingState,
        setIsLoadingState,
        saveStateToRedis,
        loadStateFromRedis,
        clearStateFromRedis,
    }
}
