import { useState } from 'react'
import type { CSSProperties } from 'react'
import { flowScenarios } from '../../data/cors'
import type { FlowMarker } from '../../data/cors'
import styles from './RequestFlow.module.css'

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

export function RequestFlow() {
  const [modeId, setModeId] = useState(flowScenarios[0].id)
  const [step, setStep] = useState(0)

  const scenario = flowScenarios.find((s) => s.id === modeId) ?? flowScenarios[0]
  const steps = scenario.steps
  const cur = steps[Math.min(step, steps.length - 1)]
  const atStart = step === 0
  const atEnd = step === steps.length - 1

  const changeMode = (id: string) => {
    setModeId(id)
    setStep(0)
  }
  const advance = (dir: number) => setStep((s) => Math.min(Math.max(s + dir, 0), steps.length - 1))

  const stepColor = markerColor(cur.marker, cur.arrow)
  const wireColor =
    cur.arrow === 'request' ? 'var(--accent)' : cur.arrow === 'response' ? 'var(--ok)' : 'var(--border)'
  const badgeColor =
    cur.marker === 'ok' ? 'var(--ok)' : cur.marker === 'blocked' ? 'var(--danger-strong)' : 'var(--accent)'
  const label = cur.marker === 'ok' || cur.marker === 'blocked' ? `${markerGlyph(cur.marker)} ${cur.label}` : cur.label
  const browserActive = cur.arrow !== 'request'
  const serverActive = cur.arrow === 'request'

  return (
    <section id="flow" className="section">
      <h2 className="h2">How a request actually flows</h2>
      <p className="lead">
        Pick a scenario and step through it. Some succeed; the rest are the failures people actually hit. The line
        shows the current hop: a blue arrow flows from browser to server on the way out, a green one flows back on the
        reply. Each step shows the exact bytes on the wire and what the browser decides.
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
                  style={{ background: s.outcome === 'blocked' ? 'var(--danger-strong)' : 'var(--ok)' }}
                />
                {s.label}
              </button>
            )
          })}
        </div>

        <div className={styles.stage}>
          <div className={styles.track}>
            <div className={`${styles.node} ${styles.nodeBrowser}`}>
              <div
                className={styles.nodeIcon}
                style={{
                  background: 'var(--accent-surface)',
                  borderColor: browserActive ? stepColor : 'var(--accent-border)',
                  boxShadow: browserActive ? `0 0 0 3px color-mix(in srgb, ${stepColor} 22%, transparent)` : 'none',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 8h18" />
                  <circle cx="6" cy="6" r="0.6" style={{ fill: 'var(--accent)' }} />
                </svg>
              </div>
              <div className={styles.nodeName}>Browser</div>
              <div className={styles.nodeHost}>app.example.com</div>
            </div>

            <div className={`${styles.node} ${styles.nodeServer}`}>
              <div
                className={styles.nodeIcon}
                style={{
                  background: 'var(--surface-cream)',
                  borderColor: serverActive ? stepColor : 'var(--border)',
                  boxShadow: serverActive ? `0 0 0 3px color-mix(in srgb, ${stepColor} 22%, transparent)` : 'none',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ stroke: 'var(--warn-ink)' }} strokeWidth="1.8">
                  <rect x="4" y="4" width="16" height="6" rx="1.5" />
                  <rect x="4" y="14" width="16" height="6" rx="1.5" />
                  <path d="M8 7h.01M8 17h.01" />
                </svg>
              </div>
              <div className={styles.nodeName}>Server</div>
              <div className={styles.nodeHost}>api.example.com</div>
            </div>

            <div className={styles.wireArea}>
              <div className={styles.wire} data-dir={cur.arrow} style={{ '--wire': wireColor } as CSSProperties} />
              {cur.arrow === 'request' && <span className={styles.arrowRight} style={{ borderLeftColor: wireColor }} />}
              {cur.arrow === 'response' && <span className={styles.arrowLeft} style={{ borderRightColor: wireColor }} />}
              <div className={styles.wireLabel} style={{ color: stepColor, borderColor: stepColor }}>
                {label}
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
          <button className={styles.prev} onClick={() => advance(-1)} disabled={atStart}>
            <span aria-hidden="true">←</span> Prev
          </button>

          <div className={styles.progress}>
            {steps.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === step ? styles.dotOn : ''}`}
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === step ? 'step' : undefined}
                onClick={() => setStep(i)}
              />
            ))}
            <span className={styles.counter}>
              {step + 1} / {steps.length}
            </span>
          </div>

          <button className={styles.next} onClick={() => advance(1)} disabled={atEnd}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
