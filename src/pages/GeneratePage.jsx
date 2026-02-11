import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraphBackground } from '../components/GraphBackground'

const DEFAULT_SKILLS = ['', '', '', '']

export function GeneratePage() {
  const [oneWord, setOneWord] = useState('')
  const [prompt, setPrompt] = useState('')
  const [skills, setSkills] = useState([...DEFAULT_SKILLS])

  const addSkill = () => {
    setSkills((s) => [...s, ''])
  }

  const removeSkill = (index) => {
    if (skills.length <= 1) return
    setSkills((s) => s.filter((_, i) => i !== index))
  }

  const updateSkill = (index, value) => {
    setSkills((s) => {
      const next = [...s]
      next[index] = value
      return next
    })
  }

  const finalSkills = skills.filter((s) => s.trim() !== '')

  return (
    <div className="relative min-h-screen bg-[#2d2d2d]">
      <GraphBackground seedWord={oneWord} skillCount={skills.length} />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 sm:py-16 text-left">
        <header className="mb-10">
          <Link
            to="/home"
            className="font-name text-2xl text-[#f2f2f7] font-semibold tracking-tight hover:text-[#8e8e93]"
          >
            skilledclaws
          </Link>
          <p className="text-[#8e8e93] text-sm mt-1">
            generate · teach your claude bot anything
          </p>
        </header>

        {/* One word — diagram generates from this */}
        <section className="mb-6" aria-label="One word">
          <h2 className="text-[#8e8e93] text-xs font-medium uppercase tracking-wider mb-3">
            One word
          </h2>
          <input
            type="text"
            value={oneWord}
            onChange={(e) => setOneWord(e.target.value)}
            placeholder="Enter one word — diagram generates from this"
            className="w-full px-4 py-3 rounded-xl bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7] placeholder:text-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:border-[#0a84ff]"
            aria-label="One word for diagram"
          />
        </section>

        {/* Step 1: User prompt */}
        <section className="mb-10" aria-label="Your prompt">
          <h2 className="text-[#8e8e93] text-xs font-medium uppercase tracking-wider mb-3">
            Step 1 — Prompt
          </h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want your Claude bot to do..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7] placeholder:text-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:border-[#0a84ff] resize-y min-h-[80px]"
            aria-label="User prompt"
          />
        </section>

        {/* Step 2: Skills list with add/remove */}
        <section className="mb-10" aria-label="Skills">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#8e8e93] text-xs font-medium uppercase tracking-wider">
              Step 2 — Skills
            </h2>
            <button
              type="button"
              onClick={addSkill}
              className="text-xs font-medium text-[#8e8e93] hover:text-[#f2f2f7] px-2 py-1 rounded border border-[#48484a] hover:border-[#636366]"
            >
              + Add skill
            </button>
          </div>
          <ul className="space-y-2">
            {skills.map((skill, index) => (
              <li key={index} className="flex gap-2 items-center">
                <span className="text-[#8e8e93] text-sm w-6 shrink-0 font-normal">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder={`Skill ${index + 1}`}
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7] placeholder:text-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:border-[#0a84ff] text-sm"
                  aria-label={`Skill ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  disabled={skills.length <= 1}
                  className="shrink-0 p-2 rounded-lg text-[#8e8e93] hover:text-[#f2f2f7] hover:bg-[#48484a] disabled:opacity-40 disabled:pointer-events-none"
                  aria-label={`Remove skill ${index + 1}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Step 3: Final skills feature */}
        <section className="mb-10" aria-label="Final skills">
          <h2 className="text-[#8e8e93] text-xs font-medium uppercase tracking-wider mb-3">
            Step 3 — Final skills
          </h2>
          <div className="rounded-xl border border-[#48484a] bg-[#3a3a3c] p-4">
            {finalSkills.length > 0 ? (
              <ul className="space-y-2">
                {finalSkills.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#8e8e93]">→</span>
                    <span className="text-[#f2f2f7]">{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#8e8e93] text-sm font-normal">
                Add and fill skills above to see your final skill pack.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-[#48484a]">
              <button
                type="button"
                disabled={finalSkills.length === 0}
                className="px-4 py-2.5 rounded-xl bg-[#f2f2f7] text-[#2d2d2d] font-medium text-sm hover:bg-white disabled:opacity-50 disabled:pointer-events-none"
              >
                generate skill pack
              </button>
            </div>
          </div>
        </section>

        <p className="text-[#8e8e93] text-xs font-normal">
          <Link to="/home" className="text-[#8e8e93] hover:text-[#f2f2f7] underline decoration-[#48484a]">
            ← back to home
          </Link>
        </p>
      </main>
    </div>
  )
}
