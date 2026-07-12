// All textual content for the CORS explainer, kept separate from presentation.
// Ported from the original "CORS Explained" project.

export interface NavItem {
  /** Page id used for routing/visibility. */
  id: string
  label: string
}

export const navItems: NavItem[] = [
  { id: 'what', label: 'What is CORS' },
  { id: 'same-origin', label: 'Same-origin policy' },
  { id: 'why', label: 'Why it exists' },
  { id: 'browser', label: 'Browser feature · curl' },
  { id: 'protocol', label: 'Simple, preflight & OPTIONS' },
  { id: 'flow', label: 'Request flow' },
  { id: 'headers', label: 'The headers & playground' },
  { id: 'server', label: 'Server setup' },
  { id: 'debug', label: 'Diagnosing an error' },
  { id: 'gotchas', label: 'Common gotchas' },
]

export interface OriginRow {
  url: string
  verdict: 'SAME' | 'CROSS'
  why: string
}

/** Compared against https://app.example.com */
export const originRows: OriginRow[] = [
  { url: 'https://app.example.com/x', verdict: 'SAME', why: 'exact match' },
  { url: 'https://app.example.com:443/y', verdict: 'SAME', why: 'default https port' },
  { url: 'http://app.example.com', verdict: 'CROSS', why: 'scheme differs' },
  { url: 'https://api.example.com', verdict: 'CROSS', why: 'host differs' },
  { url: 'https://app.example.com:8443', verdict: 'CROSS', why: 'port differs' },
]

export type FlowArrow = 'none' | 'request' | 'response'
export type FlowMarker = number | 'ok' | 'blocked'

export interface FlowStep {
  /** Packet position along the browser→server track, as a percentage. */
  pos: number
  arrow: FlowArrow
  /** Short label shown on the moving packet. */
  label: string
  marker: FlowMarker
  title: string
  detail: string
}

export interface FlowScenario {
  id: string
  label: string
  outcome: 'ok' | 'blocked'
  steps: FlowStep[]
}

export const flowScenarios: FlowScenario[] = [
  {
    id: 'simple',
    label: 'Simple GET',
    outcome: 'ok',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'GET /data',
        marker: 1,
        title: 'Browser prepares the request',
        detail:
          'The page calls fetch(). Method GET, no custom headers, so this qualifies as a "simple request" and no preflight is needed.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'GET + Origin',
        marker: 2,
        title: 'Request sent, with an Origin header',
        detail:
          'Origin: https://app.example.com\n\nThe browser attaches Origin automatically. You cannot remove or fake it from JavaScript.',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 + ACAO',
        marker: 3,
        title: 'Server responds with the CORS header',
        detail:
          'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://app.example.com\n\nThe body is already here. Now the browser must decide if JS may read it.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'readable',
        marker: 'ok',
        title: 'Browser checks ACAO: match',
        detail:
          'ACAO equals the page origin, so the Promise resolves and response.json() works. Had the header been missing or different, this is where it would throw.',
      },
    ],
  },
  {
    id: 'preflight',
    label: 'Preflighted PUT',
    outcome: 'ok',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'PUT + JSON',
        marker: 1,
        title: 'Browser sees a non-simple request',
        detail:
          'Method PUT with Content-Type: application/json and an Authorization header. Not simple, so the browser must preflight before sending it.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'OPTIONS',
        marker: 2,
        title: 'Preflight sent (you did not write this)',
        detail:
          'OPTIONS /data\nOrigin: https://app.example.com\nAccess-Control-Request-Method: PUT\nAccess-Control-Request-Headers: authorization, content-type',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '204 + allows',
        marker: 3,
        title: 'Server approves the preflight',
        detail:
          'HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, PUT, DELETE\nAccess-Control-Allow-Headers: authorization, content-type',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'PUT /data',
        marker: 4,
        title: 'Now the real request goes',
        detail:
          'PUT /data\nAuthorization: Bearer …\nContent-Type: application/json\n\n{"name": "…"}\n\nOnly because the preflight passed.',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 + ACAO',
        marker: 5,
        title: 'Actual response, checked again',
        detail:
          'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://app.example.com\n\nACAO is validated once more on the real response.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'readable',
        marker: 'ok',
        title: 'JavaScript receives the result',
        detail:
          'Two round-trips total. Access-Control-Max-Age lets the browser cache steps 2 and 3 so repeat calls skip straight to the PUT.',
      },
    ],
  },
  {
    id: 'noheader',
    label: 'No Allow-Origin',
    outcome: 'blocked',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'GET /data',
        marker: 1,
        title: 'A perfectly ordinary GET',
        detail: 'The page fetches an API on a different origin. Nothing wrong on the client side.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'GET + Origin',
        marker: 2,
        title: 'Request sent',
        detail: 'Origin: https://app.example.com\n\nThe request reaches the server and runs successfully.',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 (no ACAO)',
        marker: 3,
        title: 'Server replies, but forgot the header',
        detail:
          'HTTP/1.1 200 OK\nContent-Type: application/json\n(no Access-Control-Allow-Origin)\n\n{"data": "…"}\n\nThe full body is sitting on the wire.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'blocked',
        marker: 'blocked',
        title: 'Browser throws the response away',
        detail:
          'No Access-Control-Allow-Origin header, so the browser refuses to expose the body to JavaScript. This is the classic error at the top of the page. Note the server still ran and logged a 200.',
      },
    ],
  },
  {
    id: 'mismatch',
    label: 'Origin not allowed',
    outcome: 'blocked',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'GET /data',
        marker: 1,
        title: 'Request from app.example.com',
        detail: 'The page origin is https://app.example.com.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'GET + Origin',
        marker: 2,
        title: 'Request sent',
        detail: 'Origin: https://app.example.com',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 + wrong ACAO',
        marker: 3,
        title: 'Server allows a different origin',
        detail:
          'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://staging.example.com\n\nThe allowlist names the wrong origin.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'blocked',
        marker: 'blocked',
        title: 'Origins do not match',
        detail:
          'ACAO says https://staging.example.com but the page is https://app.example.com. No match, so the browser blocks it. A wrong allowlist entry looks identical to a missing header.',
      },
    ],
  },
  {
    id: 'credentials',
    label: 'With cookies',
    outcome: 'ok',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'GET + creds',
        marker: 1,
        title: 'fetch(url, { credentials: "include" })',
        detail: 'You opt in to sending cookies. This raises the bar: the server now needs two headers, not one.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'GET + Cookie',
        marker: 2,
        title: 'Cookie rides along automatically',
        detail: 'Origin: https://app.example.com\nCookie: session=…\n\nThe browser attaches the auth cookie for you.',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 + 2 headers',
        marker: 3,
        title: 'Server echoes origin AND allows credentials',
        detail:
          'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true\n\nExact origin (never "*") plus the credentials flag.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'readable',
        marker: 'ok',
        title: 'Both conditions met',
        detail:
          'Exact origin echoed and Allow-Credentials: true present, so the browser exposes the authenticated response to your JavaScript.',
      },
    ],
  },
  {
    id: 'wildcardcreds',
    label: 'Wildcard + cookies',
    outcome: 'blocked',
    steps: [
      {
        pos: 2,
        arrow: 'none',
        label: 'GET + creds',
        marker: 1,
        title: 'Credentials included again',
        detail: 'credentials: "include", so cookies will be sent.',
      },
      {
        pos: 50,
        arrow: 'request',
        label: 'GET + Cookie',
        marker: 2,
        title: 'Cookie attached',
        detail: 'Origin: https://app.example.com\nCookie: session=…',
      },
      {
        pos: 50,
        arrow: 'response',
        label: '200 + ACAO: *',
        marker: 3,
        title: 'Server tries the wildcard',
        detail:
          'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true\n\nWildcard used together with credentials.',
      },
      {
        pos: 2,
        arrow: 'none',
        label: 'blocked',
        marker: 'blocked',
        title: 'Wildcard is forbidden with cookies',
        detail:
          'When credentials are included, Access-Control-Allow-Origin may not be "*", even with Allow-Credentials: true. The browser rejects it. Echo the exact origin instead.',
      },
    ],
  },
]

export interface HeaderDoc {
  name: string
  tag: string
  /** 'required' renders the tag in green; everything else is neutral. */
  tone: 'required' | 'default'
  example: string
  desc: string
}

export const headerDocs: HeaderDoc[] = [
  {
    name: 'Access-Control-Allow-Origin',
    tag: 'REQUIRED',
    tone: 'required',
    example: 'Access-Control-Allow-Origin: https://app.example.com',
    desc: 'The one header that must be present. It takes a single value: one exact origin, or "*". You cannot comma-separate a list. To support several origins (say production and staging), check the incoming Origin header against your own allowlist and echo back the matching one. If it is missing or does not match the page origin, the browser blocks the response.',
  },
  {
    name: 'Access-Control-Allow-Methods',
    tag: 'PREFLIGHT',
    tone: 'default',
    example: 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE',
    desc: 'Sent on the OPTIONS response. Lists the HTTP methods allowed for the actual request. Only consulted during a preflight.',
  },
  {
    name: 'Access-Control-Allow-Headers',
    tag: 'PREFLIGHT',
    tone: 'default',
    example: 'Access-Control-Allow-Headers: Content-Type, Authorization',
    desc: 'Sent on the OPTIONS response. Lists the request headers the client is permitted to send. Custom headers must appear here or the preflight fails.',
  },
  {
    name: 'Access-Control-Allow-Credentials',
    tag: 'COOKIES',
    tone: 'default',
    example: 'Access-Control-Allow-Credentials: true',
    desc: 'Required when the request includes cookies via credentials:"include". Classic trigger: you move from JWT bearer tokens (which just worked) to cookie-based sessions, and everything breaks. You need this header server-side AND credentials:"include" client-side. When set, ACAO may NOT be "*", it must name the exact origin.',
  },
  {
    name: 'Access-Control-Max-Age',
    tag: 'PERF',
    tone: 'default',
    example: 'Access-Control-Max-Age: 86400',
    desc: 'How long (seconds) the browser may cache this preflight result, so repeated calls skip the OPTIONS round-trip.',
  },
  {
    name: 'Access-Control-Expose-Headers',
    tag: 'OPTIONAL',
    tone: 'default',
    example: 'Access-Control-Expose-Headers: X-Total-Count',
    desc: 'By default JS can only read a handful of response headers. List any others here to make them readable via response.headers.get().',
  },
]

export interface SetupLink {
  name: string
  src: string
  href: string
}

export interface SetupGroup {
  label: string
  links: SetupLink[]
}

export const setupGroups: SetupGroup[] = [
  {
    label: 'JAVASCRIPT / NODE',
    links: [
      { name: 'Express · cors', src: 'expressjs.com', href: 'https://expressjs.com/en/resources/middleware/cors.html' },
      { name: 'Fastify · @fastify/cors', src: 'github.com', href: 'https://github.com/fastify/fastify-cors' },
      { name: 'NestJS', src: 'docs.nestjs.com', href: 'https://docs.nestjs.com/security/cors' },
      { name: 'Koa · @koa/cors', src: 'github.com', href: 'https://github.com/koajs/cors' },
      {
        name: 'Next.js route handlers',
        src: 'nextjs.org',
        href: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors',
      },
      { name: 'Hono', src: 'hono.dev', href: 'https://hono.dev/docs/middleware/builtin/cors' },
    ],
  },
  {
    label: 'PYTHON',
    links: [
      { name: 'Flask · flask-cors', src: 'flask-cors.rtfd.io', href: 'https://flask-cors.readthedocs.io/' },
      {
        name: 'Django · django-cors-headers',
        src: 'github.com',
        href: 'https://github.com/adamchainz/django-cors-headers',
      },
      { name: 'FastAPI · CORSMiddleware', src: 'fastapi.tiangolo.com', href: 'https://fastapi.tiangolo.com/tutorial/cors/' },
      { name: 'Starlette', src: 'starlette.io', href: 'https://www.starlette.io/middleware/#corsmiddleware' },
    ],
  },
  {
    label: 'RUBY',
    links: [
      { name: 'Rails · rack-cors', src: 'github.com', href: 'https://github.com/cyu/rack-cors' },
      { name: 'Sinatra · sinatra-cross_origin', src: 'github.com', href: 'https://github.com/britg/sinatra-cross_origin' },
    ],
  },
  {
    label: 'PHP',
    links: [
      { name: 'Laravel · HandleCors', src: 'laravel.com', href: 'https://laravel.com/docs/routing' },
      { name: 'Symfony · NelmioCorsBundle', src: 'github.com', href: 'https://github.com/nelmio/NelmioCorsBundle' },
    ],
  },
  {
    label: 'GO',
    links: [
      { name: 'rs/cors (net/http)', src: 'github.com', href: 'https://github.com/rs/cors' },
      { name: 'Gin · gin-contrib/cors', src: 'github.com', href: 'https://github.com/gin-contrib/cors' },
      { name: 'Fiber · cors middleware', src: 'docs.gofiber.io', href: 'https://docs.gofiber.io/api/middleware/cors' },
    ],
  },
  {
    label: 'JAVA / KOTLIN',
    links: [
      {
        name: 'Spring · CORS support',
        src: 'spring.io',
        href: 'https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html',
      },
      { name: 'Ktor · CORS plugin', src: 'ktor.io', href: 'https://ktor.io/docs/server-cors.html' },
    ],
  },
  {
    label: '.NET',
    links: [
      { name: 'ASP.NET Core · CORS', src: 'learn.microsoft.com', href: 'https://learn.microsoft.com/aspnet/core/security/cors' },
    ],
  },
  {
    label: 'RUST',
    links: [
      { name: 'Actix · actix-cors', src: 'docs.rs', href: 'https://docs.rs/actix-cors/latest/actix_cors/' },
      {
        name: 'Axum · tower-http CorsLayer',
        src: 'docs.rs',
        href: 'https://docs.rs/tower-http/latest/tower_http/cors/index.html',
      },
    ],
  },
  {
    label: 'WEB SERVERS / EDGE',
    links: [
      {
        name: 'Nginx · add_header',
        src: 'nginx.org',
        href: 'https://nginx.org/en/docs/http/ngx_http_headers_module.html',
      },
      {
        name: 'Apache · mod_headers',
        src: 'httpd.apache.org',
        href: 'https://httpd.apache.org/docs/current/mod/mod_headers.html',
      },
      {
        name: 'Cloudflare Workers',
        src: 'developers.cloudflare.com',
        href: 'https://developers.cloudflare.com/workers/examples/cors-header-proxy/',
      },
    ],
  },
  {
    label: 'REFERENCE',
    links: [
      { name: 'MDN · CORS guide', src: 'developer.mozilla.org', href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
      {
        name: 'MDN · Access-Control-Allow-Origin',
        src: 'developer.mozilla.org',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin',
      },
      {
        name: 'WHATWG · Fetch (CORS protocol)',
        src: 'fetch.spec.whatwg.org',
        href: 'https://fetch.spec.whatwg.org/#http-cors-protocol',
      },
    ],
  },
]

export interface DebugStep {
  n: number
  q: string
  a: string
}

export const debugSteps: DebugStep[] = [
  {
    n: 1,
    q: 'Did a preflight fire?',
    a: 'Look for an OPTIONS request to the same endpoint. What status did it return? A 404 or 405 on OPTIONS means your server has no preflight handler, so the real request never leaves. The console still just calls it a "CORS error".',
  },
  {
    n: 2,
    q: 'If it did, what came back on the OPTIONS?',
    a: 'Check that the OPTIONS response allows the right origin, the right method (Access-Control-Allow-Methods), and every request header you send (Access-Control-Allow-Headers). Any one missing fails the preflight.',
  },
  {
    n: 3,
    q: 'If no preflight, is Allow-Origin present on the real response?',
    a: 'For a simple request the server already answered. Look at the response headers: if Access-Control-Allow-Origin is absent, that is your error, exactly as the console said.',
  },
  {
    n: 4,
    q: 'Does Allow-Origin exactly match your origin?',
    a: 'Compare it character-for-character to your page origin, scheme, host, and port. A wrong or stale allowlist entry looks identical to a missing header. Watch trailing slashes and http vs https.',
  },
]

export interface Gotcha {
  title: string
  body: string
}

export const gotchas: Gotcha[] = [
  {
    title: '"*" and credentials are mutually exclusive',
    body: 'If the request sends cookies, Access-Control-Allow-Origin cannot be "*". You must echo the exact origin and also send Access-Control-Allow-Credentials: true.',
  },
  {
    title: 'Your OPTIONS route returns 404 or 405',
    body: 'The framework routes OPTIONS to your handler, which rejects it. The preflight never gets its Allow-* headers, so the real request fails. Let the CORS middleware own OPTIONS.',
  },
  {
    title: 'Redirects break preflight',
    body: 'A 301/302 on a preflighted request (e.g. missing trailing slash, http→https) discards CORS. Call the final URL directly.',
  },
  {
    title: 'Forgetting Vary: Origin',
    body: 'If you echo the origin dynamically but a cache (CDN) stores one origin’s response and serves it to another, users get the wrong ACAO. Send Vary: Origin.',
  },
  {
    title: 'Reading a header that isn’t exposed',
    body: 'response.headers.get("X-Foo") returns null cross-origin unless X-Foo is named in Access-Control-Expose-Headers, even when the response is allowed.',
  },
  {
    title: 'Confusing it with a network error',
    body: 'A CORS failure surfaces to fetch as a generic TypeError with no status, so the details are only in the browser console, never in the Promise rejection.',
  },
]
