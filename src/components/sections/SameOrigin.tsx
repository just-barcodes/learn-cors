import { originRows } from '../../data/cors'
import styles from './SameOrigin.module.css'

export function SameOrigin() {
  return (
    <section id="same-origin" className="section">
      <h2 className="h2">The same-origin policy</h2>
      <p className="lead">
        By default, a modern browser lets a page make requests to its <strong>own origin</strong> freely, but restricts
        what scripts can do with responses from <strong>other</strong> origins. CORS is the mechanism a server uses to
        opt specific other origins back in.
      </p>
      <p className="prose">
        An <strong>origin</strong> is the triple <span className="chip">scheme + host + port</span>. Change any one and
        it is a different origin. Compared against{' '}
        <span className={styles.okOrigin}>https://app.example.com</span>:
      </p>

      <div className={styles.table}>
        {originRows.map((row, i) => (
          <div key={row.url} className={`${styles.row} ${i % 2 ? styles.rowAlt : ''}`}>
            <span className={styles.url}>{row.url}</span>
            <span className={styles.verdict}>
              <span className={`badge ${row.verdict === 'SAME' ? 'badge--ok' : 'badge--danger'}`}>{row.verdict}</span>
              <span className={styles.why}>{row.why}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="callout" style={{ marginTop: 14 }}>
        <div className="callout__icon" aria-hidden="true">
          i
        </div>
        <div>
          This is why your very first CORS error usually shows up in <strong>local development</strong>. A front-end on{' '}
          <code className="chip">localhost:3000</code> calling a backend on <code className="chip">localhost:8000</code>{' '}
          is two <em>different</em> origins, even though both are your own machine. The browser has no idea they are
          related and applies the same rules it would to two unrelated sites.
        </div>
      </div>
    </section>
  )
}
