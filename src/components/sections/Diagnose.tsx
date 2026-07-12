import { debugSteps } from '../../data/cors'
import styles from './Diagnose.module.css'

export function Diagnose() {
  return (
    <section id="debug" className="section">
      <h2 className="h2">Diagnosing a CORS error</h2>
      <p className="lead">
        Stop pasting headers until something changes. The console tells you a CORS policy blocked the request and almost
        nothing else. It will not mention that a preflight fired, or that your <code className="chip">OPTIONS</code>{' '}
        route returned a 404. All of that lives one tab over.
      </p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className={styles.console}>
          <div className={styles.consoleLabel}>THE CONSOLE</div>
          <div className={styles.consoleBody}>
            Gives you a <strong>summary</strong>. One red line, no status codes, no request timeline. Useful to know
            something is wrong, useless for knowing what.
          </div>
        </div>
        <div className={styles.network}>
          <div className={styles.networkLabel}>THE NETWORK TAB</div>
          <div className={styles.networkBody}>
            Gives you <strong style={{ color: '#fff' }}>evidence</strong>. The actual OPTIONS and real requests, their
            status codes, and the exact response headers on each. Debug here.
          </div>
        </div>
      </div>

      <div className={styles.steps}>
        {debugSteps.map((d) => (
          <div key={d.n} className={styles.step}>
            <div className={styles.num}>{d.n}</div>
            <div>
              <div className={styles.q}>{d.q}</div>
              <div className={styles.a}>{d.a}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="note">
        One of those four is almost always the answer. None of them can be fixed from the front-end, because the policy
        lives on the server.
      </p>
    </section>
  )
}
