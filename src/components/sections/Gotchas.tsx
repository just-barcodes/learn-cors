import { gotchas } from '../../data/cors'
import styles from './Gotchas.module.css'

export function Gotchas() {
  return (
    <section id="gotchas" className="section">
      <div className="kicker">10 · TRAPS</div>
      <h2 className="h2">Common gotchas</h2>
      <div className={styles.list}>
        {gotchas.map((g) => (
          <div key={g.title} className={styles.item}>
            <div className={styles.icon} aria-hidden="true">
              !
            </div>
            <div>
              <div className={styles.title}>{g.title}</div>
              <div className={styles.body}>{g.body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
