import type { NavItem } from '../data/cors'
import styles from './Sidebar.module.css'

interface SidebarProps {
  items: NavItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Sections">
        {items.map((item, i) => {
          const active = item.id === activeId
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active ? 'page' : undefined}
              className={`${styles.link} ${active ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onSelect(item.id)
              }}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
