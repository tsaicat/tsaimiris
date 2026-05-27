import React from 'react'
import styles from './HomePage.module.css'

export default function HomePage({ fragrances, onNavigate }) {
  const owned = fragrances.filter(f => f.status === 'owned')
  const wishlist = fragrances.filter(f => f.status === 'wishlist')
  const topRated = [...owned].filter(f => f.rating).sort((a,b) => b.rating - a.rating).slice(0, 3)

  // Collect all notes
  const noteCounts = {}
  owned.forEach(f => {
    ;[...(f.topNotes||[]), ...(f.middleNotes||[]), ...(f.baseNotes||[])].forEach(n => {
      noteCounts[n] = (noteCounts[n] || 0) + 1
    })
  })
  const topNotes = Object.entries(noteCounts).sort((a,b) => b[1]-a[1]).slice(0, 8)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroSub}>Your personal fragrance sanctuary</span>
          <h1 className={styles.heroTitle}>TsaiMiris</h1>
          <p className={styles.heroDesc}>
            Track your collection, build your wishlist, and discover scent connections.
          </p>
        </div>
        <div className={styles.heroBottles}>
          {['#D4B86A','#8B6F47','#C4A04A'].map((c, i) => (
            <svg key={i} viewBox="0 0 40 70" fill="none" className={styles.heroBottle} style={{ animationDelay: `${i * 0.15}s` }}>
              <rect x="8" y="20" width="24" height="38" rx="5" fill={c} opacity={0.9 - i*0.1} />
              <rect x="12" y="12" width="16" height="10" rx="3" fill={c} opacity={0.7} />
              <rect x="16" y="7" width="8" height="7" rx="2" fill="#C4A04A" />
              <rect x="12" y="28" width="16" height="2" rx="1" fill="white" fillOpacity="0.3" />
            </svg>
          ))}
        </div>
      </div>

      <div className={styles.stats}>
        <button className={styles.stat} onClick={() => onNavigate('collection')}>
          <span className={styles.statNum}>{owned.length}</span>
          <span className={styles.statLabel}>In Collection</span>
        </button>
        <div className={styles.statDivider} />
        <button className={styles.stat} onClick={() => onNavigate('wishlist')}>
          <span className={styles.statNum}>{wishlist.length}</span>
          <span className={styles.statLabel}>On Wishlist</span>
        </button>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{topNotes.length > 0 ? topNotes[0][0] : '—'}</span>
          <span className={styles.statLabel}>Top Note</span>
        </div>
      </div>

      {topRated.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Highest Rated</h2>
          <div className={styles.topList}>
            {topRated.map((f, i) => (
              <div key={f.id} className={styles.topItem}>
                <span className={styles.topRank}>{i + 1}</span>
                <div className={styles.topInfo}>
                  <span className={styles.topName}>{f.name}</span>
                  <span className={styles.topBrand}>{f.brand}</span>
                </div>
                <div className={styles.topStars}>
                  {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topNotes.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Signature Notes</h2>
          <div className={styles.noteCloud}>
            {topNotes.map(([note, count]) => (
              <span key={note} className={styles.noteCloudChip} style={{ fontSize: `${12 + count * 1.5}px` }}>
                {note}
                <span className={styles.noteCount}>{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
