import { headerDocs } from '../../data/cors'
import styles from './HeaderDocs.module.css'

export function HeaderDocs() {
  return (
    <section id="headers" className="section">
      <h2 className="h2">The headers, one by one</h2>
      <div className={styles.list}>
        {headerDocs.map((h) => (
          <div key={h.name} className={styles.item}>
            <div className={styles.head}>
              <code className={styles.name}>{h.name}</code>
              <span className={`badge ${h.tone === 'required' ? 'badge--ok' : 'badge--neutral'}`}>{h.tag}</span>
            </div>
            <div className={styles.example}>{h.example}</div>
            <div className={styles.desc}>{h.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
