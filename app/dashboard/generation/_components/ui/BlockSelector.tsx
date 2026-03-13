import { User, Briefcase, Clock, CheckSquare, Square } from 'lucide-react'
import type { SourceBlock, BusinessSourcePreview } from '@/lib/businessSourceGeneration'
import { isBlockDisabled } from '../utils'

type Props = {
    preview: BusinessSourcePreview
    selectedBlocks: Set<SourceBlock>
    onToggleBlock: (block: SourceBlock) => void
    labels: {
        blocksTitle: string
        blockProfile: string
        blockProfileDesc: string
        blockServices: string
        blockServicesDesc: string
        blockHours: string
        blockHoursDesc: string
    }
}

const blockDefs = [
    {
        key: 'profile' as const,
        icon: User,
        labelKey: 'blockProfile' as const,
        descKey: 'blockProfileDesc' as const,
    },
    {
        key: 'services' as const,
        icon: Briefcase,
        labelKey: 'blockServices' as const,
        descKey: 'blockServicesDesc' as const,
    },
    {
        key: 'hours' as const,
        icon: Clock,
        labelKey: 'blockHours' as const,
        descKey: 'blockHoursDesc' as const,
    },
]

export function BlockSelector({
    preview,
    selectedBlocks,
    onToggleBlock,
    labels,
}: Props) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {labels.blocksTitle}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {blockDefs.map(({ key, icon: Icon, labelKey, descKey }) => {
                    const isSelected = selectedBlocks.has(key)
                    const disabled = isBlockDisabled(key, preview)
                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={disabled}
                            onClick={() => onToggleBlock(key)}
                            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${disabled
                                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-40'
                                    : isSelected
                                        ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isSelected && !disabled
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-sm font-semibold ${isSelected && !disabled ? 'text-blue-800' : 'text-slate-800'
                                        }`}
                                >
                                    {labels[labelKey]}
                                </p>
                                <p className="text-xs leading-relaxed text-slate-500">
                                    {labels[descKey]}
                                </p>
                            </div>
                            <div
                                className={`mt-0.5 shrink-0 ${isSelected && !disabled ? 'text-blue-500' : 'text-slate-300'
                                    }`}
                            >
                                {isSelected && !disabled ? (
                                    <CheckSquare className="h-4 w-4" />
                                ) : (
                                    <Square className="h-4 w-4" />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
