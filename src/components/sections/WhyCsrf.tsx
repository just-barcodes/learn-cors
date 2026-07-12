import styles from './WhyCsrf.module.css'

export function WhyCsrf() {
  return (
    <section id="why" className="section">
      <h2 className="h2">Why it exists</h2>
      <p className="lead">
        The attack this was designed to prevent has a name: <strong>Cross-Site Request Forgery (CSRF)</strong>. A
        browser attaches a site's cookies to <em>every</em> request bound for that site's domain, no matter which page
        triggered the request. That is simply how cookies work.
      </p>

      <div className={styles.attack}>
        <div className={styles.attackLabel}>THE ATTACK: CROSS-SITE REQUEST FORGERY</div>
        <p className={styles.attackText}>
          You are logged into <span className="chip">bank.com</span> and the session cookie sits in your browser. You
          open another tab. It looks like an ordinary page. It quietly runs:
        </p>
        <pre className={`code ${styles.attackCode}`}>
          <span className="c-fn">fetch</span>(<span className="c-string">'https://bank.com/transfer'</span>, {'{'}
          {'\n  '}method: <span className="c-string">'POST'</span>,{'\n  '}credentials:{' '}
          <span className="c-attr">'include'</span> <span className="c-comment">// attach bank.com cookies</span>
          {'\n'}
          {'}'})
        </pre>
        <p className={styles.attackText} style={{ margin: 0 }}>
          The <code className="chip">credentials: 'include'</code> flag tells the browser to send your{' '}
          <span className="chip">bank.com</span> cookies along. The bank receives what looks like an authenticated
          request from you, and the transfer goes through. You clicked nothing.
        </p>
      </div>

      <p className="prose">
        This is why by default the browser refuses to expose a "cross-origin response" to scripts. CORS is the
        controlled way a server backend relaxes that, saying{' '}
        <em>“I know this origin, I trust it, let the response through.”</em>
      </p>
      <p className="prose" style={{ color: 'var(--text-faint)', marginBottom: 0 }}>
        Crucially, the attacker's site can <em>fire</em> a cross-origin request but <b>cannot</b>{' '}
        <strong>forge the server's response headers</strong>. Only the real server can send{' '}
        <code className="chip">Access-Control-Allow-Origin</code>. As long as the server is configured correctly, the
        attacker is locked out of both reading the response and, for sensitive requests, sending it at all.
      </p>
    </section>
  )
}
