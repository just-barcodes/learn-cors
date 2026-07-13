import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { navItems } from './data/cors'
import { Sidebar } from './components/Sidebar'
import { Hero } from './components/sections/Hero'
import { SameOrigin } from './components/sections/SameOrigin'
import { WhyItExists } from './components/sections/WhyItExists'
import { BrowserVsCurl } from './components/sections/BrowserVsCurl'
import { SimpleVsPreflight } from './components/sections/SimpleVsPreflight'
import { Options } from './components/sections/Options'
import { RequestFlow } from './components/sections/RequestFlow'
import { HeaderDocs } from './components/sections/HeaderDocs'
import { Playground } from './components/sections/Playground'
import { ServerSetup } from './components/sections/ServerSetup'
import { Diagnose } from './components/sections/Diagnose'
import { Gotchas } from './components/sections/Gotchas'
import styles from './App.module.css'

const pages: Record<string, ReactNode> = {
  what: <Hero />,
  'same-origin': <SameOrigin />,
  why: <WhyItExists />,
  browser: <BrowserVsCurl />,
  protocol: (
    <>
      <SimpleVsPreflight />
      <Options />
    </>
  ),
  flow: <RequestFlow />,
  headers: (
    <>
      <HeaderDocs />
      <Playground />
    </>
  ),
  server: <ServerSetup />,
  debug: <Diagnose />,
  gotchas: <Gotchas />,
}

const validIds = new Set(navItems.map((n) => n.id))

function readHash(): string {
  const id = window.location.hash.replace(/^#/, '')
  return validIds.has(id) ? id : 'what'
}

export function App() {
  const [active, setActive] = useState(readHash)

  useEffect(() => {
    const onHashChange = () => {
      setActive(readHash())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleSelect = (id: string) => {
    window.location.hash = id
  }

  return (
    <div className={styles.shell}>
      <Sidebar items={navItems} activeId={active} onSelect={handleSelect} />
      <main className={styles.main}>{pages[active]}</main>
    </div>
  )
}
