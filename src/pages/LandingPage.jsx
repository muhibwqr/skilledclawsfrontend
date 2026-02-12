import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PILLS = [
  { id: 'sample', label: 'sample' },
  { id: 'day-trading', label: 'day trading' },
  { id: 'technical-analysis', label: 'technical analysis' },
  { id: 'risk-management', label: 'risk management' },
  { id: 'chart-patterns', label: 'chart patterns' },
]

function ArrowUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e?.preventDefault()
    const word = (input.trim().split(/\s+/)[0] || 'sample').trim()
    if (!word) return
    navigate('/diagram', { state: { word } })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full px-6">
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        {/* Main headline — big and visual */}
        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-display font-semibold text-[#f2f2f7] mb-10 tracking-[-0.03em] leading-tight text-center w-full">
          What do you want to teach your clawdbot?
        </h1>

        {/* iMessage-style input with send button inside */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="day trading, API docs, custom playbook..."
              rows={1}
              className="w-full min-h-[90px] max-h-[200px] px-6 py-4 pr-14 bg-[#3a3a3c] border border-[#48484a] rounded-2xl text-[17px] text-[#f2f2f7] placeholder:text-[#8e8e93] resize-none focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff]"
              style={{ lineHeight: '22px' }}
              aria-label="What do you want to teach your clawdbot?"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-[36px] w-[36px] rounded-full bg-[#48484a] hover:bg-[#636366] text-[#8e8e93] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Submit"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </form>

        {/* Pills: click to put that text in the input box */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 w-full">
          {PILLS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setInput(label)}
              className="px-4 py-2.5 rounded-full bg-[#3a3a3c] border border-[#48484a] text-[14px] text-[#8e8e93] hover:text-[#f2f2f7] hover:border-[#636366] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
