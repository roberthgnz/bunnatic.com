import { useState, useEffect } from 'react'
import { getGenerationEntitlement } from '@/lib/supabase/actions'
import type { GenerationEntitlement } from '@/lib/businessSourceGeneration'

export function useEntitlement() {
    const [entitlement, setEntitlement] = useState<GenerationEntitlement | null>(
        null
    )

    const loadEntitlement = async () => {
        const result = await getGenerationEntitlement()
        if ('error' in result) return
        setEntitlement(result.entitlement)
    }

    useEffect(() => {
        void loadEntitlement()
    }, [])

    const isLimitReached = Boolean(
        entitlement?.isLimited && (entitlement.remaining ?? 0) <= 0
    )

    const quotaLabel = entitlement?.isLimited
        ? `${entitlement.usedThisMonth}/${entitlement.monthlyLimit}`
        : null

    return {
        entitlement,
        isLimitReached,
        quotaLabel,
        loadEntitlement,
        setEntitlement,
    }
}
