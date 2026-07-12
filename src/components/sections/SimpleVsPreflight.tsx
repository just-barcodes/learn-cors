import styles from './SimpleVsPreflight.module.css'

export function SimpleVsPreflight() {
  return (
    <section id="simple-preflight" className="section">
      <h2 className="h2">Simple vs. preflighted requests</h2>
      <p className="lead">
        The browser decides whether it can send your request directly, or whether it must ask permission first. The
        dividing line is whether the request could have been made by an old HTML form, if not, it gets a preflight.
      </p>

      <div className="grid-2" style={{ marginBottom: 8 }}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            <span className={styles.cardTitle}>Simple request</span>
          </div>
          <p className={styles.intro}>
            Sent directly. Qualifies only if <em>all</em> of:
          </p>
          <ul className={styles.list}>
            <li>
              method is <code className="chip">GET</code>, <code className="chip">POST</code>, or{' '}
              <code className="chip">HEAD</code>
            </li>
            <li>only safelisted headers</li>
            <li>
              <code className="chip">Content-Type</code> is <code className="chip">text/plain</code>,{' '}
              <code className="chip">multipart/form-data</code>, or{' '}
              <code className="chip">application/x-www-form-urlencoded</code>
            </li>
            <li>
              no custom / <code className="chip">Authorization</code> header
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={`${styles.dot} ${styles.dotAmber}`} />
            <span className={styles.cardTitle}>Preflighted request</span>
          </div>
          <p className={styles.intro}>
            An <code className="chip">OPTIONS</code> check is sent first. Triggered by <em>any</em> of:
          </p>
          <ul className={styles.list}>
            <li>
              method like <code className="chip">PUT</code>, <code className="chip">PATCH</code>,{' '}
              <code className="chip">DELETE</code>
            </li>
            <li>
              <code className="chip">Content-Type: application/json</code>
            </li>
            <li>
              <code className="chip">Authorization</code> or any custom header
            </li>
            <li>reading certain response headers, etc.</li>
          </ul>
        </div>
      </div>

      <p className="note">
        Almost every real API call, JSON body, bearer token, is preflighted. That is why the next section matters so
        much.
      </p>
    </section>
  )
}
