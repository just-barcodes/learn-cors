export function Hero() {
  return (
    <section id="what" className="section">
      <h1 className="h1">Cross-Origin Resource Sharing (CORS)</h1>
      <p className="lead-lg">
        CORS is <b>a browser feature</b>. It is the rulebook a browser follows before it{' '}
        <b>hands one website the response from a different</b> website. It is <strong>not</strong> a firewall, not
        authentication, and not something your server enforces on its own. It is a conversation, conducted in HTTP
        headers, that the browser has with your backend.
      </p>
      <pre className="code" aria-label="Example CORS console error">
        <span className="c-error">
          ✗ Access to fetch at <span className="c-fg">'https://api.example.com/data'</span> from origin
        </span>
        {'\n'}
        <span className="c-error">
          {'  '}
          <span className="c-fg">'https://app.example.com'</span> has been blocked by CORS policy:
        </span>
        {'\n'}
        <span className="c-error">
          {'  '}No <span className="c-attr">'Access-Control-Allow-Origin'</span> header is present on the
        </span>
        {'\n'}
        <span className="c-error">{'  '}requested resource.</span>
      </pre>
      <p className="note">
        If that message brought you here: the request <em>succeeded</em>. The server answered. The browser simply
        refused to let your JavaScript read the answer. Below is exactly why, and exactly what to change.
      </p>
    </section>
  )
}
