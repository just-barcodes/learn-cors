import styles from './Options.module.css'

export function Options() {
  return (
    <section id="options" className="section">
      <h2 className="h2">The OPTIONS preflight</h2>
      <p className="lead">
        Before sending a non-simple request, the browser sends an automatic <code className="chip">OPTIONS</code>{' '}
        request that carries no body. It is asking: <em>“I am about to send a PUT with an Authorization header from this
        origin, is that allowed?”</em> Your server must answer, or the real request never leaves the browser.
      </p>

      <div className={styles.pair}>
        <div className={styles.panel}>
          <div className={styles.panelLabel} data-tone="request">
            ↗ PREFLIGHT REQUEST (browser sends)
          </div>
          <pre className={styles.wire}>
            <span className="c-string">OPTIONS</span> /data HTTP/1.1{'\n'}
            <span className="c-attr">Origin</span>: https://app.example.com{'\n'}
            <span className="c-attr">Access-Control-Request-Method</span>: PUT{'\n'}
            <span className="c-attr">Access-Control-Request-Headers</span>: authorization,{'\n'}
            {'  '}content-type
          </pre>
        </div>
        <div className={`${styles.panel} ${styles.panelAlt}`}>
          <div className={styles.panelLabel} data-tone="response">
            ↙ PREFLIGHT RESPONSE (server answers)
          </div>
          <pre className={styles.wire}>
            HTTP/1.1 <span className="c-string">204 No Content</span>
            {'\n'}
            <span className="c-attr">Access-Control-Allow-Origin</span>: https://app.example.com{'\n'}
            <span className="c-attr">Access-Control-Allow-Methods</span>: GET, PUT, DELETE{'\n'}
            <span className="c-attr">Access-Control-Allow-Headers</span>: authorization,{'\n'}
            {'  '}content-type{'\n'}
            <span className="c-attr">Access-Control-Max-Age</span>: 86400
          </pre>
        </div>
      </div>

      <div className={styles.outcomes}>
        <div className={styles.outcome}>
          <div className={styles.outcomeTitle}>If the preflight passes</div>
          <div className={styles.outcomeBody}>
            the browser sends the real <code className="chip">PUT</code>. Its response is checked against ACAO again.
          </div>
        </div>
        <div className={styles.outcome}>
          <div className={styles.outcomeTitle}>If it fails</div>
          <div className={styles.outcomeBody}>
            the real request is <strong>never sent</strong>. You see a CORS error and zero traffic in your API logs for
            the actual call.
          </div>
        </div>
        <div className={styles.outcome}>
          <div className={styles.outcomeTitle}>
            <code className="chip">Max-Age</code> caches it
          </div>
          <div className={styles.outcomeBody}>
            the browser skips the preflight for that long, cutting the round-trip on repeat calls.
          </div>
        </div>
      </div>
    </section>
  )
}
