import { useEffect, useRef, useState } from 'react'
import createEngine, { DefaultNodeModel, DiagramModel } from '@projectstorm/react-diagrams'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { API_BASE } from '../config'
import { DiamondNodeModel, DiamondNodeFactory } from './diagram/DiamondNode'

const MAX_LABEL_LEN = 10

function truncate(str) {
  if (typeof str !== 'string') return '—'
  return str.length <= MAX_LABEL_LEN ? str : str.slice(0, MAX_LABEL_LEN - 1) + '…'
}

/**
 * Mesh diagram using react-diagrams: Input word (A) + skills from API (B,C,D,F) + Continue (E).
 * Calls SkilledClaws backend POST /api/generate to get mainSkill + subSkills.
 * See: https://github.com/muhibwqr/skilledclaws
 */
const SAMPLE_LABELS = {
  A: 'sample',
  B: 'sample',
  C: 'sample',
  D: 'sample',
  F: 'sample',
  E: 'sample',
}

const API_TIMEOUT_MS = 15000

function fetchWithTimeout(url, options, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId)
  )
}

export function FlowDiagram({ inputWord = 'sample' }) {
  const word = (inputWord || 'sample').trim().split(/\s+/)[0] || 'sample'
  const isSample = word.toLowerCase() === 'sample'
  const containerRef = useRef(null)
  const [engine, setEngine] = useState(null)
  const [labels, setLabels] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modelReady, setModelReady] = useState(false)
  const [additionalSkills, setAdditionalSkills] = useState([])
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [addSkillInput, setAddSkillInput] = useState('')
  const [addSkillSubmitting, setAddSkillSubmitting] = useState(false)

  // Sample preview: no API call, use sample labels. Otherwise fetch from backend.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setModelReady(false)
    setAdditionalSkills([])

    if (isSample) {
      setLabels(SAMPLE_LABELS)
      setLoading(false)
      return
    }

    setLabels(null)
    const url = `${API_BASE}/api/generate`
    fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName: word }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'API error')
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const main = data.mainSkill?.name ?? (typeof data.mainSkill === 'string' ? data.mainSkill : word)
        const subs = Array.isArray(data.subSkills) ? data.subSkills.map((s) => (s && typeof s === 'object' && s.name != null ? s.name : String(s))) : []
        const four = [main, ...subs].slice(0, 4)
        while (four.length < 4) four.push('—')
        setLabels({
          A: word,
          B: four[0],
          C: four[1],
          D: four[2],
          F: four[3],
          E: 'Continue',
        })
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.name === 'AbortError' ? 'Request timed out' : err.message)
          setLabels({
            A: word,
            B: 'B',
            C: 'C',
            D: 'D',
            F: 'F',
            E: 'Continue',
          })
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [word])

  // Create engine once and register diamond node type
  useEffect(() => {
    const diagramEngine = createEngine()
    diagramEngine.getNodeFactories().registerFactory(new DiamondNodeFactory())
    setEngine(diagramEngine)
  }, [])

  // Build model when engine, labels, or additionalSkills change
  useEffect(() => {
    if (!engine || !labels) return

    const model = new DiagramModel()
    const nodeColor = '#dc3545'
    const nodeColorDiamond = '#343a40'
    const extraCount = additionalSkills.length

    const nodeC = new DefaultNodeModel({ name: truncate(labels.C), color: nodeColor })
    nodeC.setPosition(120, 250)
    nodeC.addOutPort(' ')

    const nodeA = new DefaultNodeModel({ name: truncate(labels.A), color: nodeColor })
    nodeA.setPosition(280, 250)
    nodeA.addInPort(' ')
    nodeA.addOutPort(' ')
    nodeA.addOutPort(' ')
    nodeA.addOutPort(' ')
    for (let i = 0; i < extraCount; i++) nodeA.addOutPort(' ')

    const nodeD = new DefaultNodeModel({ name: truncate(labels.D), color: nodeColor })
    nodeD.setPosition(400, 250)
    nodeD.addInPort(' ')
    nodeD.addOutPort(' ')
    nodeD.addOutPort(' ')

    const nodeB = new DefaultNodeModel({ name: truncate(labels.B), color: nodeColor })
    nodeB.setPosition(340, 380)
    nodeB.addInPort(' ')
    nodeB.addInPort(' ')
    nodeB.addOutPort(' ')

    const nodeF = new DefaultNodeModel({ name: truncate(labels.F), color: nodeColor })
    nodeF.setPosition(340, 120)
    nodeF.addInPort(' ')
    nodeF.addInPort(' ')
    nodeF.addOutPort(' ')

    const nodeE = new DiamondNodeModel({ name: labels.E, color: nodeColorDiamond })
    nodeE.setPosition(520, 250)
    nodeE.addInPort(' ')
    nodeE.addInPort(' ')
    for (let i = 0; i < extraCount; i++) nodeE.addInPort(' ')

    const link1 = nodeC.getOutPorts()[0].link(nodeA.getInPorts()[0])
    const link2 = nodeA.getOutPorts()[0].link(nodeD.getInPorts()[0])
    const link3 = nodeA.getOutPorts()[1].link(nodeB.getInPorts()[0])
    const link4 = nodeA.getOutPorts()[2].link(nodeF.getInPorts()[0])
    const link5 = nodeD.getOutPorts()[0].link(nodeB.getInPorts()[1])
    const link6 = nodeD.getOutPorts()[1].link(nodeF.getInPorts()[1])
    const link7 = nodeB.getOutPorts()[0].link(nodeE.getInPorts()[0])
    const link8 = nodeF.getOutPorts()[0].link(nodeE.getInPorts()[1])

    const allNodes = [nodeC, nodeA, nodeD, nodeB, nodeF, nodeE]
    const allLinks = [link1, link2, link3, link4, link5, link6, link7, link8]

    // Additional skill nodes: A → new node → E (between D and E)
    additionalSkills.forEach((skill, i) => {
      const node = new DefaultNodeModel({ name: truncate(skill.label), color: nodeColor })
      node.setPosition(460, 80 + i * 70)
      node.addInPort(' ')
      node.addOutPort(' ')
      const fromA = nodeA.getOutPorts()[3 + i].link(node.getInPorts()[0])
      const toE = node.getOutPorts()[0].link(nodeE.getInPorts()[2 + i])
      allNodes.push(node)
      allLinks.push(fromA, toE)
    })

    model.addAll(...allNodes, ...allLinks)

    model.getLinks().forEach((link) => {
      if (typeof link.setColor === 'function') link.setColor('#6c757d')
    })

    model.setLocked(false)
    allNodes.forEach((node) => node.setLocked(false))

    engine.setModel(model)
    engine.repaintCanvas()
    setModelReady(true)
  }, [engine, labels, additionalSkills])

  // Repaint and zoom-to-fit when container/canvas is ready so diagram is visible
  useEffect(() => {
    if (!engine || !modelReady || !containerRef.current) return
    let fitTimer
    const timer = requestAnimationFrame(() => {
      engine.repaintCanvas()
      // Allow canvas to be attached and laid out, then fit diagram in view
      fitTimer = setTimeout(() => {
        if (engine.getCanvas?.()) {
          try {
            engine.zoomToFit?.()
            engine.repaintCanvas()
          } catch (_) {
            // zoomToFit may throw if dimensions not ready
          }
        }
      }, 100)
    })
    return () => {
      cancelAnimationFrame(timer)
      if (fitTimer) clearTimeout(fitTimer)
    }
  }, [engine, modelReady])

  if (!engine) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 text-[#8e8e93] text-sm">
        <div className="w-8 h-8 border-2 border-[#48484a] border-t-[#f2f2f7] rounded-full animate-spin" />
        <span>Loading</span>
      </div>
    )
  }

  if (loading && !labels) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 text-[#8e8e93] text-sm">
        <div className="w-8 h-8 border-2 border-[#48484a] border-t-[#f2f2f7] rounded-full animate-spin" />
        <span>Loading</span>
      </div>
    )
  }

  if (!modelReady) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 text-[#8e8e93] text-sm">
        <div className="w-8 h-8 border-2 border-[#48484a] border-t-[#f2f2f7] rounded-full animate-spin" />
        <span>Loading</span>
      </div>
    )
  }

  const openAddSkill = () => {
    setAddSkillInput('')
    setShowAddSkillModal(true)
  }

  const closeAddSkillModal = () => {
    if (!addSkillSubmitting) setShowAddSkillModal(false)
  }

  const submitAddSkill = async (e) => {
    e?.preventDefault()
    const text = addSkillInput.trim()
    if (!text) return
    setAddSkillSubmitting(true)
    try {
      await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: text }),
      })
    } catch (_) {
      // still add node locally if API fails
    }
    setAdditionalSkills((prev) => [...prev, { id: Date.now(), label: text }])
    setAddSkillInput('')
    setShowAddSkillModal(false)
    setAddSkillSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#5a3a3a] bg-[#3a2a2a] px-4 py-3 text-[#f2a0a0] text-sm"
        >
          <p className="font-medium">API unreachable</p>
          <p className="mt-1 text-[#f2a0a0]/90">{error}. Diagram shows fallback labels.</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="flow-diagram-container w-full h-[400px] rounded-lg overflow-visible bg-[#f8f9fa] border border-[#dee2e6]"
      >
        <CanvasWidget engine={engine} className="w-full h-full" />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openAddSkill}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7] text-sm font-medium hover:bg-[#48484a] transition-colors"
        >
          <span aria-hidden>+</span>
          add skill
        </button>
      </div>

      {showAddSkillModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeAddSkillModal}
          onKeyDown={(e) => e.key === 'Escape' && closeAddSkillModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-skill-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#2d2d2d] border border-[#48484a] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="add-skill-title" className="text-lg font-semibold text-[#f2f2f7] mb-1">
              add skill
            </h2>
            <p className="text-[#8e8e93] text-sm mb-4">
              Describe the skill so we can feed it to the model. It will be added to the diagram and sent to the API.
            </p>
            <form onSubmit={submitAddSkill}>
              <textarea
                value={addSkillInput}
                onChange={(e) => setAddSkillInput(e.target.value)}
                placeholder="e.g. technical analysis, risk management…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[#3a3a3c] border border-[#48484a] text-[#f2f2f7] placeholder:text-[#8e8e93] focus:outline-none focus:ring-2 focus:ring-[#0a84ff] focus:border-[#0a84ff] resize-y text-sm mb-4"
                autoFocus
                disabled={addSkillSubmitting}
                aria-label="Skill description"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAddSkillModal}
                  disabled={addSkillSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#8e8e93] hover:text-[#f2f2f7] hover:bg-[#3a3a3c] transition-colors disabled:opacity-50"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={!addSkillInput.trim() || addSkillSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-[#0a84ff] text-white hover:bg-[#0066cc] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  {addSkillSubmitting ? 'Loading' : 'add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
