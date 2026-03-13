import {
    User,
    Briefcase,
    Clock,
    Star,
    Sparkles,
    Tag,
    AlignLeft,
    Navigation,
    PhoneCall,
    Globe,
    MapPin,
} from 'lucide-react'
import type { BusinessSourcePreview } from '@/lib/businessSourceGeneration'

type Props = {
    preview: BusinessSourcePreview
    labels: {
        blockProfile: string
        blockServices: string
        blockHours: string
        ratingLabel: string
        reviewsLabel: string
        priceLabel: string
        statusLabel: string
        mapsLabel: string
        noServices: string
        noHours: string
    }
}

export function PreviewCards({ preview, labels }: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Profile card */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                        {labels.blockProfile}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900">
                        {preview.profile.name || '—'}
                    </p>
                    {typeof preview.profile.rating === 'number' && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Star className="h-3 w-3 text-amber-500" />
                            {labels.ratingLabel}: {preview.profile.rating.toFixed(1)} / 5
                        </div>
                    )}
                    {typeof preview.profile.reviewCount === 'number' && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Sparkles className="h-3 w-3" />
                            {labels.reviewsLabel}: {preview.profile.reviewCount}
                        </div>
                    )}
                    {typeof preview.profile.priceLevel === 'number' &&
                        preview.profile.priceLevel > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Tag className="h-3 w-3" />
                                {labels.priceLabel}: {'€'.repeat(preview.profile.priceLevel)}
                            </div>
                        )}
                    {preview.profile.businessStatus && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Tag className="h-3 w-3" />
                            {labels.statusLabel}: {preview.profile.businessStatus}
                        </div>
                    )}
                    {preview.profile.category && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Tag className="h-3 w-3" />
                            {preview.profile.category}
                        </div>
                    )}
                    {preview.profile.description && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-600">
                            <AlignLeft className="mt-0.5 h-3 w-3 shrink-0" />
                            <span className="line-clamp-3">{preview.profile.description}</span>
                        </div>
                    )}
                    {preview.profile.address && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Navigation className="h-3 w-3" />
                            {preview.profile.address}
                        </div>
                    )}
                    {preview.profile.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <PhoneCall className="h-3 w-3" />
                            {preview.profile.phone}
                        </div>
                    )}
                    {preview.profile.website && (
                        <div className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <Globe className="h-3 w-3 shrink-0" />
                            <span className="truncate">{preview.profile.website}</span>
                        </div>
                    )}
                    {preview.profile.mapsUrl && (
                        <div className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                                {labels.mapsLabel}: {preview.profile.mapsUrl}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {/* Services card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                            {labels.blockServices}
                        </p>
                    </div>
                    {preview.services.length > 0 ? (
                        <ul className="space-y-1">
                            {preview.services.map((service) => (
                                <li
                                    key={service.name}
                                    className="flex items-center gap-2 text-xs text-slate-700"
                                >
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                                    {service.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">{labels.noServices}</p>
                    )}
                </div>

                {/* Hours card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                            {labels.blockHours}
                        </p>
                    </div>
                    {preview.hours.length > 0 ? (
                        <ul className="space-y-1">
                            {preview.hours.map((hour) => (
                                <li
                                    key={`${hour.day_of_week}-${hour.open_time}-${hour.close_time}`}
                                    className="flex items-center justify-between text-xs text-slate-700"
                                >
                                    <span className="font-medium text-slate-600">
                                        {hour.day_of_week}
                                    </span>
                                    <span
                                        className={
                                            hour.is_closed
                                                ? 'text-slate-400 italic'
                                                : 'text-slate-800'
                                        }
                                    >
                                        {hour.is_closed
                                            ? '—'
                                            : `${hour.open_time ?? '—'} · ${hour.close_time ?? '—'}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-slate-400 italic">{labels.noHours}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
