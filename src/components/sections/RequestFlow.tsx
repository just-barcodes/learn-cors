import { useEffect, useState } from 'react'
import { flowScenarios } from '../../data/cors'
import type { FlowMarker } from '../../data/cors'
import styles from './RequestFlow.module.css'

const ARROW_GLYPH = { request: '→', response: '←', none: '' } as const

function markerColor(marker: FlowMarker, arrow: 'request' | 'response' | 'none'): string {
  if (marker === 'blocked') return 'var(--danger-strong)'
  if (marker === 'ok') return 'var(--ok)'
  if (arrow === 'response') return 'var(--ok)'
  if (arrow === 'request') return 'var(--accent)'
  return 'var(--text-dim)'
}

function markerGlyph(marker: FlowMarker): string {
  if (marker === 'ok') return '✓'
  if (marker === 'blocked') return '✗'
  return String(marker)
}

const STEP_MS = 1500

export function RequestFlow() {
  const [modeId, setModeId] = useState(flowScenarios[0].id)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const scenario = flowScenarios.find((s) => s.id === modeId) ?? flowScenarios[0]
  const steps = scenario.steps
  const cur = steps[Math.min(step, steps.length - 1)]
  const running = playing && step < steps.length - 1

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [running, step])

  const changeMode = (id: string) => {
    setModeId(id)
    setStep(0)
    setPlaying(false)
  }

  const advance = (dir: number) => {
    setPlaying(false)
    setStep((s) => Math.min(Math.max(s + dir, 0), steps.length - 1))
  }

  const togglePlay = () => {
    if (running) {
      setPlaying(false)
      return
    }
    if (step >= steps.length - 1) setStep(0)
    setPlaying(true)
  }

  const packetColor = markerColor(cur.marker, cur.arrow)
  const badgeColor =
    cur.marker === 'ok' ? 'var(--ok)' : cur.marker === 'blocked' ? 'var(--danger-strong)' : 'var(--accent)'
  const packetLabel = cur.marker === 'ok' || cur.marker === 'blocked' ? `${markerGlyph(cur.marker)} ${cur.label}` : cur.label

  return (
    <section id="flow" className="section">
      <h2 className="h2">How a request actually flows</h2>
      <p className="lead">
        Pick a scenario and click through it step by step. The first three succeed; the rest are the failures people
        actually hit. Green dots allow, red dots block. Each step shows the exact bytes on the wire and what the browser
        decides.
      </p>

      <div className={styles.frame}>
        <div className={styles.tabs} role="tablist" aria-label="Request scenarios">
          {flowScenarios.map((s) => {
            const on = s.id === modeId
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                className={`${styles.tab} ${on ? styles.tabOn : ''}`}
                onClick={() => changeMode(s.id)}
              >
                <span
                  className={styles.tabDot}
                  style={{ background: s.outcome === 'blocked' ? '#c0392b' : 'var(--ok)' }}
                />
                {s.label}
              </button>
            )
          })}
        </div>

        <div className={styles.stage}>
          <div className={styles.track}>
            <div className={styles.line} />

            <div className={`${styles.node} ${styles.nodeBrowser}`}>
              <div className={styles.nodeIcon} style={{ background: 'var(--accent-surface)', borderColor: 'var(--accent-border)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f5eea" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 8h18" />
                  <circle cx="6" cy="6" r="0.6" fill="#2f5eea" />
                </svg>
              </div>
              <div className={styles.nodeName}>Browser</div>
              <div className={styles.nodeHost}>app.example.com</div>
            </div>

            <div className={`${styles.node} ${styles.nodeServer}`}>
              <div className={styles.nodeIcon} style={{ background: '#f0ede4', borderColor: '#d8d1c1' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a7f63" strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="6" rx="1.5" />
                  <rect x="4" y="14" width="16" height="6" rx="1.5" />
                  <path d="M8 7h.01M8 17h.01" />
                </svg>
              </div>
              <div className={styles.nodeName}>Server</div>
              <div className={styles.nodeHost}>api.example.com</div>
            </div>

            <div className={styles.packet} style={{ left: `${cur.pos}%` }}>
              <div
                className={styles.packetArrow}
                style={{ color: packetColor, opacity: cur.arrow === 'none' ? 0 : 1 }}
              >
                {ARROW_GLYPH[cur.arrow]}
              </div>
              <div className={styles.packetLabel} style={{ background: packetColor }}>
                {packetLabel}
              </div>
            </div>
          </div>

          <div className={styles.caption} aria-live="polite">
            <div className={styles.captionHead}>
              <span className={styles.stepBadge} style={{ background: badgeColor }}>
                {markerGlyph(cur.marker)}
              </span>
              <span className={styles.stepTitle}>{cur.title}</span>
            </div>
            <div className={styles.stepDetail}>{cur.detail}</div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.buttons}>
            <button className={styles.stepBtn} onClick={() => advance(-1)} disabled={step === 0} aria-label="Previous step">
              ←
            </button>
            <button
              className={styles.stepBtn}
              onClick={() => advance(1)}
              disabled={step === steps.length - 1}
              aria-label="Next step"
            >
              →
            </button>
            <button className={styles.playBtn} onClick={togglePlay}>
              {running ? 'Pause' : 'Play'}
            </button>
          </div>
          <div className={styles.progress}>
            {steps.map((_, i) => (
              <span key={i} className={styles.progressDot} style={{ background: i === step ? 'var(--accent)' : '#d8d1c1' }} />
            ))}
            <span className={styles.counter}>
              {step + 1} / {steps.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
