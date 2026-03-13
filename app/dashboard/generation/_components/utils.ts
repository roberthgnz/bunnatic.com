import type { BusinessSourcePreview, SourceBlock } from '@/lib/businessSourceGeneration'

export function getProfileHasContent(preview: BusinessSourcePreview): boolean {
    const { profile } = preview
    return [
        profile.name,
        profile.category,
        profile.description,
        profile.address,
        profile.phone,
        profile.website,
    ].some((value) => value.trim().length > 0)
}

export function getDefaultSelectedBlocks(
    preview: BusinessSourcePreview
): Set<SourceBlock> {
    const next = new Set<SourceBlock>()
    if (getProfileHasContent(preview)) next.add('profile')
    if (preview.services.length > 0) next.add('services')
    if (preview.hours.length > 0) next.add('hours')
    return next
}

export function isBlockDisabled(
    key: SourceBlock,
    preview: BusinessSourcePreview | null
): boolean {
    if (!preview) return true
    if (key === 'profile') return !getProfileHasContent(preview)
    if (key === 'services') return preview.services.length === 0
    if (key === 'hours') return preview.hours.length === 0
    return false
}
