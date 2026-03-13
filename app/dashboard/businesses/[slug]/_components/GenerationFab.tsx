import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GenerationFab({ slug }: { slug: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed right-8 bottom-8 z-50 duration-500">
      <Button
        size="icon"
        className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
        asChild
      >
        <Link href={`/dashboard/businesses/${slug}/generation`}>
          <Sparkles className="size-6 animate-pulse" />
        </Link>
      </Button>
    </div>
  )
}
