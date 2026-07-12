import { setupGroups } from '../../data/cors'
import styles from './ServerSetup.module.css'

export function ServerSetup() {
  return (
    <section id="server" className="section">
      <h2 className="h2">Setting it up on the server</h2>
      <p className="lead">
        CORS is configured on the server, so the exact steps depend on your stack. Below are the official CORS guides
        and the standard middleware for the languages, frameworks, and servers people use most. Pick yours.
      </p>

      <div className={styles.grid}>
        {setupGroups.map((grp) => (
          <div key={grp.label} className={styles.group}>
            <div className={styles.groupLabel}>{grp.label}</div>
            <div className={styles.links}>
              {grp.links.map((lnk) => (
                <a key={lnk.href} href={lnk.href} target="_blank" rel="noopener" className={styles.link}>
                  <span className={styles.linkName}>{lnk.name}</span>
                  <span className={styles.linkSrc}>{lnk.src}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="callout" style={{ marginTop: 20 }}>
        <div>
          No matter the framework, the bytes on the wire are the same: send{' '}
          <code className="chip">Access-Control-Allow-Origin</code> on the real response, and answer the{' '}
          <code className="chip">OPTIONS</code> preflight with the matching <code className="chip">Allow-*</code>{' '}
          headers. The library just writes them for you.
        </div>
      </div>
    </section>
  )
}
