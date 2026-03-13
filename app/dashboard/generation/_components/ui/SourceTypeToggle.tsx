import { MapPin, Globe } from 'lucide-react'
import type { SourceType } from '@/lib/businessSourceGeneration'

type Props = {
    sourceType: SourceType
    onSourceChange: (source: SourceType) => void
    labels: {
        sourceLabel: string
        sourceGoogle: string
        sourceUrl: string
    }
}

export function SourceTypeToggle({ sourceType, onSourceChange, labels }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {labels.sourceLabel}
            </p>
            <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                    type="button"
                    onClick={() => onSourceChange('google')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${sourceType === 'google'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MapPin className="h-3.5 w-3.5" />
                    {labels.sourceGoogle}
                </button>
                <button
                    type="button"
                    onClick={() => onSourceChange('url')}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${sourceType === 'url'
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Globe className="h-3.5 w-3.5" />
                    {labels.sourceUrl}
                </button>
            </div>
        </div>
    )
}
