import { useLocation } from 'react-router-dom'
import { FlowDiagram } from '../components/FlowDiagram'

export function DiagramPage() {
  const location = useLocation()
  const word = location.state?.word ?? new URLSearchParams(location.search).get('word') ?? 'sample'

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 pt-12 pb-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full rounded-2xl overflow-hidden border border-[#dee2e6] bg-[#f8f9fa] shadow-sm">
          <FlowDiagram inputWord={word} />
        </div>
        <p className="text-[#8e8e93] text-xs mt-6 text-center max-w-md">
          {word.toLowerCase() === 'sample' ? (
            <>Preview: all nodes show <span className="text-[#ea580c] font-semibold">sample</span>. Enter a real word on the home page to fetch skills from the API.</>
          ) : (
            <><span className="text-[#ea580c] font-semibold">A</span> = your word · B–F = skills from API · <span className="text-[#f2f2f7] font-medium">E</span> = Continue</>
          )}
        </p>
      </div>
    </div>
  )
}
