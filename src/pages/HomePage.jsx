import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ROTATING_PHRASES = [
  'to answer from your docs',
  'to use your API',
  'to follow your playbook',
  'to speak in your style',
]

const PILL_OPTIONS = [
  'answer from my docs',
  'use my API',
  'follow my playbook',
  'speak in my style',
]

export function HomePage() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % ROTATING_PHRASES.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#2d2d2d]">
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 sm:py-16 text-left">
        <header className="mb-14">
          <h1 className="font-name text-4xl sm:text-5xl text-[#f2f2f7] font-semibold tracking-tight mb-3">
            skilledclaws
          </h1>
          <p className="text-[#8e8e93] text-base sm:text-lg">
            teach your claude bot anything · veteran .skills · drop into clawdbot.
          </p>
        </header>

        <ul className="space-y-10 mb-12">
          <li>
            <Link
              to="/"
              className="text-left group block"
            >
              <span className="text-[#8e8e93] text-sm font-normal">→</span>{' '}
              <span className="text-[#f2f2f7] font-medium group-hover:underline decoration-[#48484a]">
                Teach your Claude bot {ROTATING_PHRASES[phraseIndex]}
              </span>{' '}
              <span className="text-[#8e8e93] text-sm font-normal">← click to try</span>
            </Link>
            <p className="mt-1.5 text-[#8e8e93] text-sm pl-5 font-normal">
              → Pick a skill, we generate the pack. Four options rotate above.
            </p>
          </li>

          <li>
            <p className="text-[#f2f2f7] font-medium">
              <span className="text-[#8e8e93] text-sm font-normal">→</span> Veteran-level .skills
            </p>
            <p className="mt-1.5 text-[#8e8e93] text-sm pl-5 flex items-center gap-1.5 flex-wrap font-normal">
              → SKILL.md, scripts, references, assets — ready for Clawdbot
              <span className="inline-flex gap-1" aria-hidden>
                <span className="text-[#8e8e93]">📄</span>
                <span className="text-[#8e8e93]">📜</span>
                <span className="text-[#8e8e93]">📎</span>
                <span className="text-[#8e8e93]">🖼</span>
              </span>
            </p>
          </li>

          <li>
            <p className="text-[#f2f2f7] font-medium">
              <span className="text-[#8e8e93] text-sm font-normal">→</span> Generate or browse
            </p>
            <p className="mt-1.5 text-[#8e8e93] text-sm pl-5 font-normal">
              → Type below or check out the skill library{' '}
              <Link to="/" className="text-[#8e8e93] hover:text-[#f2f2f7] underline decoration-[#48484a] hover:decoration-[#636366]">
                (click here)
              </Link>
              .
            </p>
          </li>
        </ul>

        <section className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f2f2f7] text-[#2d2d2d] font-medium hover:bg-white transition-colors"
          >
            go to generate
          </Link>
        </section>

        <section className="mb-12">
          <a
            href="#skill-library"
            className="text-[#8e8e93] hover:text-[#f2f2f7] text-sm font-normal underline decoration-[#48484a] hover:decoration-[#636366]"
          >
            browse all skills →
          </a>
        </section>

        <div className="flex flex-wrap gap-2">
          {PILL_OPTIONS.map((label) => (
            <Link
              key={label}
              to="/"
              className="px-4 py-2 rounded-full text-sm font-medium bg-[#3a3a3c] border border-[#48484a] text-[#8e8e93] hover:text-[#f2f2f7] hover:border-[#636366] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
