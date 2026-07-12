import { useState } from 'react'
import type { ReactNode } from 'react'
import { navItems } from './data/cors'
import { Sidebar } from './components/Sidebar'
import { Hero } from './components/sections/Hero'
import styles from './App.module.css'

function Placeholder({ label }: { label: string }) {
  return (
    <section className="section">
      <h2 className="h2">{label}</h2>
      <div className="card">Coming next.</div>
    </section>
  )
}

const pages: Record<string, ReactNode> = {
  what: <Hero />,
  'same-origin': <Placeholder label="The same-origin policy" />,
  why: <Placeholder label="Why it exists" />,
  browser: <Placeholder label="It is a browser feature. curl still works." />,
  protocol: <Placeholder label="Simple, preflight & OPTIONS" />,
  flow: <Placeholder label="How a request actually flows" />,
  headers: <Placeholder label="The headers & playground" />,
  server: <Placeholder label="Setting it up on the server" />,
  debug: <Placeholder label="Diagnosing a CORS error" />,
  gotchas: <Placeholder label="Common gotchas" />,
}

export function App() {
  const [active, setActive] = useState('what')

  const handleSelect = (id: string) => {
    if (id === active) return
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className={styles.shell}>
      <Sidebar items={navItems} activeId={active} onSelect={handleSelect} />
      <main className={styles.main}>{pages[active]}</main>
    </div>
  )
}
