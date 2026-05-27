import React from 'react'
import styles from './SimilarityTable.module.css'

export default function SimilarityTable({ results, onSelect }) {
  if (!results || results.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Similar Fragrances</h3>
        <p className={styles.empty}>No similarities found in your collection.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Similar in My Collection</h3>
      <div className={styles.list}>
        {results.map(({ fragrance, similarity }) => (
          <button
            key={fragrance.id}
            className={styles.row}
            onClick={() => onSelect && onSelect(fragrance)}
          >
            <div className={styles.info}>
              <span className={styles.name}>{fragrance.name}</span>
              <span className={styles.brand}>{fragrance.brand}</span>
            </div>
            <div className={styles.meter}>
              <div
                className={styles.bar}
                style={{ width: `${similarity}%` }}
              />
              <span className={styles.pct}>{similarity}%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
