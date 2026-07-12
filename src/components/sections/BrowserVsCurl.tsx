import styles from './BrowserVsCurl.module.css'

export function BrowserVsCurl() {
  return (
    <section id="browser" className="section">
      <h2 className="h2">It is a browser feature. curl still works.</h2>
      <p className="lead">
        CORS is enforced <strong>by the browser</strong>, in the client. The server just states its policy in headers;
        it never refuses a request for lacking CORS. Any non-browser client, curl, Postman, your backend, a Python
        script, ignores those headers entirely and reads the body without a second thought.
      </p>

      <div className={styles.frame}>
        <div className={styles.head}>
          <span className={styles.headLabel}>SAME REQUEST, TWO CLIENTS</span>
          <span className={styles.headMeta}>
            server sends: <span className={styles.headMetaValue}>Access-Control-Allow-Origin: https://app.example.com</span>
          </span>
        </div>

        <div className={styles.cols}>
          <div className={`${styles.col} ${styles.colBordered}`}>
            <div className={styles.clientRow}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={styles.clientName}>Browser</span>
              <span className={styles.clientMeta}>page on evil.example.com</span>
            </div>
            <pre className={`code ${styles.mini}`}>
              <span className="c-fn">fetch</span>
              <span className="c-fg">(</span>
              <span className="c-string">'https://api.example.com/data'</span>
              <span className="c-fg">)</span>
              {'\n\n'}
              <span className="c-error">✗ blocked by CORS policy</span>
              {'\n'}
              <span className="c-muted">the response arrived, but JS</span>
              {'\n'}
              <span className="c-muted">cannot read it, origin not allowed</span>
            </pre>
            <p className={styles.caption}>
              The browser fetched the bytes, compared <span className={styles.captionMono}>ACAO</span> to the page
              origin, saw no match, and threw away the result.
            </p>
          </div>

          <div className={styles.col}>
            <div className={styles.clientRow}>
              <span className={`${styles.dot} ${styles.dotGreen}`} />
              <span className={styles.clientName}>curl</span>
              <span className={styles.clientMeta}>terminal, no origin concept</span>
            </div>
            <pre className={`code ${styles.mini}`}>
              <span className="c-muted">$</span> curl https://api.example.com/data
              {'\n\n'}
              <span className="c-string">HTTP/2 200</span>
              {'\n'}
              <span className="c-muted">content-type: application/json</span>
              {'\n\n'}
              <span className="c-fg">{'{"balance": 42000}'}</span>
            </pre>
            <p className={styles.caption}>
              curl never looks at <span className={styles.captionMono}>Access-Control-*</span> headers. There is no
              user, no cookies, nothing to protect, so nothing is blocked.
            </p>
          </div>
        </div>

        <div className={styles.foot}>
          <strong style={{ color: 'var(--text)' }}>Consequence:</strong> a{' '}
          <b>CORS error can never be “fixed” from the front-end</b>. Removing it means changing what the{' '}
          <em>server</em> sends. It also means CORS is worthless as a server-side security control, it stops browsers,
          not attackers.
        </div>
      </div>
    </section>
  )
}
