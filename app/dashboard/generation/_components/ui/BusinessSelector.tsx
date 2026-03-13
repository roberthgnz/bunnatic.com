import { Building2, ChevronsUpDown, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BusinessListItem } from '../types'

type Props = {
    businesses: BusinessListItem[]
    selectedBusinessId: string
    onSelectBusiness: (id: string) => void
    labels: {
        targetBusinessLabel: string
        selectTargetPlaceholder: string
        createNewBusiness: string
    }
}

export function BusinessSelector({
    businesses,
    selectedBusinessId,
    onSelectBusiness,
    labels,
}: Props) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                {labels.targetBusinessLabel}
            </p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 w-full justify-between">
                        <div className="flex items-center gap-2">
                            {selectedBusinessId === 'new' ? (
                                <>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-transparent">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{labels.createNewBusiness}</span>
                                </>
                            ) : (
                                <>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                                    </div>
                                    <span>
                                        {businesses.find((b) => b.id === selectedBusinessId)?.name ||
                                            labels.selectTargetPlaceholder}
                                    </span>
                                </>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {labels.targetBusinessLabel}
                    </DropdownMenuLabel>
                    {businesses.map((business) => (
                        <DropdownMenuItem
                            key={business.id}
                            onClick={() => onSelectBusiness(business.id)}
                            className="gap-2 p-2"
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-md border">
                                <Building2 className="h-3.5 w-3.5 shrink-0" />
                            </div>
                            <span className="flex-1">{business.name}</span>
                            {selectedBusinessId === business.id && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onSelectBusiness('new')}
                        className="gap-2 p-2"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-transparent">
                            <Plus className="h-4 w-4" />
                        </div>
                        <span className="flex-1 font-medium text-muted-foreground">
                            {labels.createNewBusiness}
                        </span>
                        {selectedBusinessId === 'new' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
