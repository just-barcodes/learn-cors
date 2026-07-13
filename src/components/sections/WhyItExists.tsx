import styles from './WhyItExists.module.css'

export function WhyItExists() {
  return (
    <section id="why" className="section">
      <h2 className="h2">Why it exists</h2>
      <p className="lead">
        The same-origin policy exists to stop one website from quietly <strong>reading your data</strong> on another. A
        browser attaches a site's cookies to <em>every</em> request bound for that site's domain, no matter which page
        triggered it. That is simply how cookies work, and it is exactly what makes a cross-origin read dangerous.
      </p>

      <div className={styles.attack}>
        <div className={styles.attackLabel}>THE ATTACK: READING A LOGGED-IN RESPONSE</div>
        <p className={styles.attackText}>
          You are logged into <span className="chip">bank.com</span> and the session cookie sits in your browser. You
          open another tab. It looks like an ordinary page. It quietly runs:
        </p>
        <pre className={`code ${styles.attackCode}`}>
          <span className="c-fn">fetch</span>(<span className="c-string">'https://bank.com/account'</span>, {'{'}
          {'\n  '}credentials: <span className="c-attr">'include'</span>{' '}
          <span className="c-comment">// attach bank.com cookies</span>
          {'\n'}
          {'}'}).<span className="c-fn">then</span>((r) {'=>'} r.<span className="c-fn">json</span>())
        </pre>
        <p className={styles.attackText} style={{ margin: 0 }}>
          The cookie rides along, so <span className="chip">bank.com</span> returns your real account data. Without the
          same-origin policy, that other page's JavaScript could read the response and ship your balance to an attacker.
          You clicked nothing.
        </p>
      </div>

      <p className="prose">
        This is why by default the browser refuses to expose a cross-origin response to scripts. CORS is the controlled
        way a server backend relaxes that, saying{' '}
        <em>“I know this origin, I trust it, let the response through.”</em>
      </p>

      <div className="callout" style={{ marginBottom: 16 }}>
        <div className="callout__icon" aria-hidden="true">
          i
        </div>
        <div>
          <strong>Not the same as CSRF.</strong> A related attack, Cross-Site Request Forgery, abuses those same
          automatic cookies to <em>trigger</em> an action (a <code className="chip">POST</code> that moves money) rather
          than read a response. CORS does not stop that: a simple cross-origin <code className="chip">POST</code> still
          reaches the server. CSRF is defended separately, with <code className="chip">SameSite</code> cookies and
          anti-CSRF tokens. CORS's contribution is the <em>preflight</em>, which gates non-simple requests before they
          are ever sent.
        </div>
      </div>

      <p className="prose" style={{ color: 'var(--text-faint)', marginBottom: 0 }}>
        Crucially, another origin can <em>fire</em> a cross-origin request but <b>cannot</b>{' '}
        <strong>forge the server's response headers</strong>. Only the real server can send{' '}
        <code className="chip">Access-Control-Allow-Origin</code>. As long as the server is configured correctly, an
        attacker is locked out of reading the response, and, for non-simple requests, out of sending it at all.
      </p>
    </section>
  )
}
