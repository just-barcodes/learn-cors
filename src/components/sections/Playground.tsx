import { useState } from 'react'
import styles from './Playground.module.css'

type Method = 'GET' | 'PUT' | 'DELETE'
type Acao = 'none' | 'origin' | 'wildcard'

interface PgState {
  method: Method
  creds: boolean
  acao: Acao
  acam: boolean
  acah: boolean
  acac: boolean
}

interface Verdict {
  allowed: boolean
  title: string
  tag: string
  reason: string
  wire: string
}

const ORIGIN = 'https://app.example.com'

const INITIAL: PgState = { method: 'GET', creds: false, acao: 'origin', acam: false, acah: false, acac: false }

/** Mirror of the browser's CORS decision for the demo's fixed origin pair. */
function computeVerdict(p: PgState): Verdict {
  const preflight = p.method !== 'GET'
  const sent: string[] = []
  if (p.acao === 'origin') sent.push(`Access-Control-Allow-Origin: ${ORIGIN}`)
  else if (p.acao === 'wildcard') sent.push('Access-Control-Allow-Origin: *')
  if (p.acam) sent.push('Access-Control-Allow-Methods: GET, PUT, DELETE')
  if (p.acah) sent.push('Access-Control-Allow-Headers: authorization, content-type')
  if (p.acac) sent.push('Access-Control-Allow-Credentials: true')

  const acaoCheck = (stage: string): { ok: boolean; reason?: string } => {
    if (p.acao === 'none')
      return {
        ok: false,
        reason: `The ${stage} response has no Access-Control-Allow-Origin header, so the browser refuses to expose it.`,
      }
    if (p.creds && p.acao === 'wildcard')
      return {
        ok: false,
        reason: `With credentials, Access-Control-Allow-Origin may not be "*". It must echo the exact origin (${ORIGIN}).`,
      }
    return { ok: true }
  }

  let blocked: string | null = null
  if (preflight) {
    const a = acaoCheck('preflight')
    if (!a.ok) blocked = a.reason!
    else if (!p.acam)
      blocked = `Access-Control-Allow-Methods is missing (or does not list ${p.method}), so the preflight fails and the real ${p.method} is never sent.`
    else if (!p.acah)
      blocked =
        'The request carries an Authorization header, but Access-Control-Allow-Headers does not list it, the preflight fails.'
    else if (p.creds && !p.acac)
      blocked = 'Credentials are included, but the preflight response lacks Access-Control-Allow-Credentials: true.'
  } else {
    const a = acaoCheck('')
    if (!a.ok) blocked = a.reason!
    else if (p.creds && !p.acac)
      blocked =
        'Credentials are included, but the response lacks Access-Control-Allow-Credentials: true, so the browser blocks it.'
  }

  const wireLines = [
    `${preflight ? 'OPTIONS then ' : ''}${p.method} /data   Origin: ${ORIGIN}${p.creds ? '   (with cookies)' : ''}`,
    'server responds:',
    ...(sent.length ? sent : ['(no Access-Control-* headers)']),
  ]

  if (blocked) {
    return {
      allowed: false,
      title: 'Blocked by CORS',
      tag: preflight ? 'preflight failed' : 'response rejected',
      reason: blocked,
      wire: wireLines.join('\n'),
    }
  }
  return {
    allowed: true,
    title: 'Response is readable',
    tag: preflight ? 'preflight passed → request sent' : 'simple request',
    reason:
      'All required headers are present and consistent, so the browser resolves the fetch and your JavaScript can read the body.' +
      (preflight ? ` The preflight passed, then the real ${p.method} completed.` : ''),
    wire: wireLines.join('\n'),
  }
}

function Toggle({ on, danger }: { on: boolean; danger?: boolean }) {
  return (
    <span className={`${styles.switch} ${on ? styles.switchOn : ''} ${on && danger ? styles.switchDanger : ''}`}>
      <span className={styles.knob} />
    </span>
  )
}

const METHODS: Method[] = ['GET', 'PUT', 'DELETE']

export function Playground() {
  const [pg, setPg] = useState<PgState>(INITIAL)
  const set = (patch: Partial<PgState>) => setPg((prev) => ({ ...prev, ...patch }))

  const acaoDesc =
    pg.acao === 'origin' ? 'echoing the exact origin' : pg.acao === 'wildcard' ? 'set to "*"' : 'not sent, click to cycle'
  const acaoOn = pg.acao !== 'none'
  const acaoDanger = pg.creds && pg.acao === 'wildcard'

  const v = computeVerdict(pg)

  return (
    <section id="playground" className="section">
      <h2 className="h2">Toggle the headers, watch the verdict</h2>
      <p className="lead">
        A page on <code className="chip">https://app.example.com</code> calls{' '}
        <code className="chip">https://api.example.com/data</code>. Configure the request on the left and the server’s
        response headers on the right. The browser’s decision updates live.
      </p>

      <div className={styles.frame}>
        <div className={styles.cols}>
          <div className={`${styles.col} ${styles.colBordered}`}>
            <div className={styles.colLabel} data-tone="request">
              ① THE BROWSER REQUEST
            </div>
            <div className={styles.fieldLabel}>Method</div>
            <div className={styles.methods}>
              {METHODS.map((m) => (
                <button
                  key={m}
                  className={`${styles.method} ${pg.method === m ? styles.methodOn : ''}`}
                  onClick={() => set({ method: m })}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className={styles.rows}>
              <button className={`${styles.row} ${pg.creds ? styles.rowOn : ''}`} onClick={() => set({ creds: !pg.creds })}>
                <span className={styles.rowText}>
                  <span className={styles.rowTitle}>Include credentials</span>
                  <span className={styles.rowDesc}>send cookies / Authorization (credentials: "include")</span>
                </span>
                <Toggle on={pg.creds} />
              </button>
            </div>
          </div>

          <div className={styles.col} style={{ background: 'var(--surface-cream)' }}>
            <div className={styles.colLabel} data-tone="server">
              ② RESPONSE HEADERS THE SERVER SENDS
            </div>
            <div className={styles.rows}>
              <button
                className={`${styles.row} ${acaoOn ? styles.rowOn : ''}`}
                onClick={() => set({ acao: pg.acao === 'none' ? 'origin' : pg.acao === 'origin' ? 'wildcard' : 'none' })}
              >
                <span className={styles.rowText}>
                  <span className={styles.rowTitleMono}>Access-Control-Allow-Origin</span>
                  <span className={styles.rowDesc}>{acaoDesc}</span>
                </span>
                <Toggle on={acaoOn} danger={acaoDanger} />
              </button>

              <button className={`${styles.row} ${pg.acam ? styles.rowOn : ''}`} onClick={() => set({ acam: !pg.acam })}>
                <span className={styles.rowText}>
                  <span className={styles.rowTitleMono}>Access-Control-Allow-Methods</span>
                  <span className={styles.rowDesc}>lists GET, PUT, DELETE</span>
                </span>
                <Toggle on={pg.acam} />
              </button>

              <button className={`${styles.row} ${pg.acah ? styles.rowOn : ''}`} onClick={() => set({ acah: !pg.acah })}>
                <span className={styles.rowText}>
                  <span className={styles.rowTitleMono}>Access-Control-Allow-Headers</span>
                  <span className={styles.rowDesc}>lists authorization, content-type</span>
                </span>
                <Toggle on={pg.acah} />
              </button>

              <button className={`${styles.row} ${pg.acac ? styles.rowOn : ''}`} onClick={() => set({ acac: !pg.acac })}>
                <span className={styles.rowText}>
                  <span className={styles.rowTitleMono}>Access-Control-Allow-Credentials</span>
                  <span className={styles.rowDesc}>set to true</span>
                </span>
                <Toggle on={pg.acac} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.verdict} style={{ background: v.allowed ? 'var(--ok)' : 'var(--danger-strong)' }}>
          <div className={styles.verdictHead}>
            <span className={styles.verdictIcon}>{v.allowed ? '✓' : '✗'}</span>
            <span className={styles.verdictTitle}>{v.title}</span>
            <span className={styles.verdictTag}>{v.tag}</span>
          </div>
          <div className={styles.verdictReason}>{v.reason}</div>
          <pre className={styles.verdictWire}>{v.wire}</pre>
        </div>
      </div>
    </section>
  )
}
