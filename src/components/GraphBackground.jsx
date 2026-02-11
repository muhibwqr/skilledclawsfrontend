/**
 * Node diagram that mirrors the generate flow:
 * Prompt (one word) → Skill 1, Skill 2, Skill 3, Skill 4 (+ add/remove) → Final skills
 * Layout: left = prompt, center = skill nodes, right = final. Generates from one word.
 */
export function GraphBackground({ seedWord = '', skillCount = 4 }) {
  const word = (seedWord || 'word').trim().split(/\s+/)[0] || 'word'

  // Flow positions (viewBox ~0–100 for x, 0–100 for y)
  const promptNode = { x: 15, y: 50, r: 8, label: word }
  const n = Math.max(1, Math.min(skillCount, 8))
  const skillNodes = Array.from({ length: n }, (_, i) => ({
    x: 50,
    y: n > 1 ? 25 + (i / (n - 1)) * 50 : 50,
    r: 5,
    label: `S${i + 1}`,
  }))
  const finalNode = { x: 85, y: 50, r: 8, label: 'Final' }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="graphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#404040" />
            <stop offset="100%" stopColor="#737373" />
          </linearGradient>
          <linearGradient id="graphGradBright" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#525252" />
            <stop offset="100%" stopColor="#737373" />
          </linearGradient>
        </defs>

        {/* Edges: Prompt → each skill */}
        {skillNodes.map((skill) => (
          <line
            key={`p-${skill.label}`}
            x1={promptNode.x + promptNode.r}
            y1={promptNode.y}
            x2={skill.x - skill.r}
            y2={skill.y}
            stroke="#404040"
            strokeWidth="0.4"
          />
        ))}

        {/* Edges: each skill → Final */}
        {skillNodes.map((skill) => (
          <line
            key={`f-${skill.label}`}
            x1={skill.x + skill.r}
            y1={skill.y}
            x2={finalNode.x - finalNode.r}
            y2={finalNode.y}
            stroke="#404040"
            strokeWidth="0.4"
          />
        ))}

        {/* Prompt node (one word) */}
        <circle
          cx={promptNode.x}
          cy={promptNode.y}
          r={promptNode.r}
          fill="url(#graphGrad)"
        />
        <text
          x={promptNode.x}
          y={promptNode.y + 0.8}
          textAnchor="middle"
          fill="#737373"
          fontSize="3"
          fontFamily="system-ui, sans-serif"
        >
          {word.slice(0, 6)}
        </text>

        {/* Skill nodes (1…4 or more with add/remove) */}
        {skillNodes.map((skill, i) => (
          <g key={skill.label}>
            <circle
              cx={skill.x}
              cy={skill.y}
              r={skill.r}
              fill="url(#graphGrad)"
            />
            <text
              x={skill.x}
              y={skill.y + 0.6}
              textAnchor="middle"
              fill="#737373"
              fontSize="2.5"
              fontFamily="system-ui, sans-serif"
            >
              {skill.label}
            </text>
          </g>
        ))}

        {/* Final node */}
        <circle
          cx={finalNode.x}
          cy={finalNode.y}
          r={finalNode.r}
          fill="url(#graphGradBright)"
        />
        <text
          x={finalNode.x}
          y={finalNode.y + 0.8}
          textAnchor="middle"
          fill="#737373"
          fontSize="2.8"
          fontFamily="system-ui, sans-serif"
        >
          Final
        </text>
      </svg>
    </div>
  )
}
