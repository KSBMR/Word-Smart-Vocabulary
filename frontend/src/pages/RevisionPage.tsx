import { useVocabulary } from '@/hooks/useVocabulary'
import { Loader2 } from 'lucide-react'

export default function RevisionPage() {
  const { totalWords, loading } = useVocabulary()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Revision</h2>
      <p className="text-muted-foreground">Reinforce your memory with spaced repetition.</p>
      <div className="p-8 text-center border rounded-lg">
        Revision system coming soon!
      </div>
    </div>
  )
}