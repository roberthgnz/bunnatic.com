import { useState } from 'react'
import { toast } from 'sonner'
import { buildBusinessSourcePreview as buildBusinessSourcePreviewAction } from '@/lib/supabase/actions'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import type { BusinessSourcePreview, SourceType, GenerationEntitlement } from '@/lib/businessSourceGeneration'

export function usePreviewGeneration(locale: string, errorMessage: string) {
    const [isBuildingPreview, setIsBuildingPreview] = useState(false)
    const [preview, setPreview] = useState<BusinessSourcePreview | null>(null)

    const buildPreview = async (
        sourceType: SourceType,
        sourcePayload: unknown,
        onSuccess: (preview: BusinessSourcePreview | null, entitlement?: GenerationEntitlement) => void
    ) => {
        setIsBuildingPreview(true)

        try {
            const result = await buildBusinessSourcePreviewAction({
                sourceType,
                sourcePayload,
            })

            if ('error' in result) {
                if (result.limitBlocked) {
                    toast.error(result.error)
                    // Return entitlement if available to update UI
                    if (result.entitlement) {
                        onSuccess(null, result.entitlement)
                    }
                    return
                }
                throw new Error(result.error || 'Preview error')
            }

            if (!result.preview) throw new Error('Preview error')

            const nextPreview = result.preview
            setPreview(nextPreview)
            onSuccess(nextPreview, result.entitlement)

            trackFunnelEvent('preview_generated', {
                source_type: sourceType,
                locale,
            })
        } catch (error) {
            console.error(error)
            toast.error(errorMessage)
        } finally {
            setIsBuildingPreview(false)
        }
    }

    const resetPreview = () => {
        setPreview(null)
    }

    return {
        isBuildingPreview,
        preview,
        buildPreview,
        resetPreview,
        setPreview,
    }
}

