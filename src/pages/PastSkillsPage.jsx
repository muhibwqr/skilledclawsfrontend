import { useState, useEffect } from 'react'
import { API_BASE } from '../config'
import { RiFolderOpenLine, RiDownloadLine, RiErrorWarningLine } from 'react-icons/ri'

export function PastSkillsPage() {
  const [skills, setSkills] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const url = `${API_BASE}/api/skills?limit=200&source=generated`
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Failed to load skills')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          setSkills(data.skills ?? [])
          setTotal(data.total ?? data.skills?.length ?? 0)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const downloadUrl = (id) => `${API_BASE}/api/skills/${id}/download`

  const formatDate = (value) => {
    if (value == null || value === '') return '—'
    const t = +new Date(value)
    if (Number.isNaN(t)) return '—'
    return new Date(value).toLocaleDateString()
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 pt-12 pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#3a3a3c] flex items-center justify-center text-[#8e8e93]">
          <RiFolderOpenLine className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-[28px] font-display font-semibold text-[#f2f2f7] tracking-[-0.02em]">
            past skills files
          </h1>
          <p className="text-[#8e8e93] text-sm mt-0.5">
            all skills ever generated
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-[#8e8e93]">
          <div className="w-8 h-8 border-2 border-[#48484a] border-t-[#f2f2f7] rounded-full animate-spin mb-4" />
          <p className="text-sm">Loading skills…</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#3a2a2a] border border-[#5a3a3a] text-[#f2a0a0]">
          <RiErrorWarningLine className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Couldn’t load skills</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2 text-[#8e8e93]">
              Make sure the API is running and CORS allows this origin.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && skills.length === 0 && (
        <div className="py-12 text-center text-[#8e8e93]">
          <RiFolderOpenLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium text-[#f2f2f7]">No generated skills yet</p>
          <p className="text-sm mt-1">Generate a skill from the home page to see it here.</p>
        </div>
      )}

      {!loading && !error && skills.length > 0 && (
        <>
          <p className="text-[#8e8e93] text-sm mb-4">
            {total} skill{total !== 1 ? 's' : ''} generated
          </p>
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li
                key={skill.id ?? `skill-${index}`}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#3a3a3c] border border-[#48484a] hover:bg-[#48484a] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#f2f2f7] truncate">{skill.name}</p>
                  {skill.description && (
                    <p className="text-[#8e8e93] text-sm mt-0.5 line-clamp-2">{skill.description}</p>
                  )}
                  <p className="text-[#8e8e93] text-xs mt-1">
                    {skill.source || 'generated'} · {formatDate(skill.created_at)}
                  </p>
                </div>
                {skill.id != null ? (
                  <a
                    href={downloadUrl(skill.id)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#48484a] border border-[#636366] text-[14px] text-[#f2f2f7] hover:bg-[#636366] transition-colors"
                  >
                    <RiDownloadLine className="w-4 h-4" />
                    download
                  </a>
                ) : (
                  <span className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#3a3a3c] border border-[#48484a] text-[14px] text-[#8e8e93] cursor-not-allowed" aria-hidden>
                    download
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
