import React from 'react'
import NoteChip from './NoteChip'
import styles from './FragranceCard.module.css'

const STARS = [1,2,3,4,5]

function RatingStars({ rating }) {
  if (!rating) return null
  return (
    <div className={styles.stars}>
      {STARS.map(s => (
        <span key={s} className={s <= rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

export default function FragranceCard({ fragrance, onClick, isSelected }) {
  const allTopNotes = (fragrance.topNotes || []).slice(0, 3)

  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onClick && onClick(fragrance)}
      aria-label={`${fragrance.name} by ${fragrance.brand}`}
    >
      <div className={styles.bottleArea}>
        {fragrance.image ? (
          <img src={fragrance.image} alt={fragrance.name} className={styles.image} />
        ) : (
          <div className={styles.bottlePlaceholder}>
            <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.bottleSvg}>
              <rect x="14" y="22" width="20" height="46" rx="5" fill="url(#bottleGrad)" />
              <rect x="17" y="14" width="14" height="10" rx="3" fill="url(#neckGrad)" />
              <rect x="20" y="8" width="8" height="8" rx="2" fill="#C4A04A" />
              <rect x="17" y="32" width="14" height="2" rx="1" fill="white" fillOpacity="0.3" />
              <rect x="17" y="40" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
              <defs>
                <linearGradient id="bottleGrad" x1="14" y1="22" x2="34" y2="68" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4B86A" />
                  <stop offset="100%" stopColor="#8B6F47" />
                </linearGradient>
                <linearGradient id="neckGrad" x1="17" y1="14" x2="31" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C4A04A" />
                  <stop offset="100%" stopColor="#9A7A38" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{fragrance.name}</h3>
          <span className={styles.brand}>{fragrance.brand}</span>
        </div>

        <RatingStars rating={fragrance.rating} />

        {allTopNotes.length > 0 && (
          <div className={styles.notes}>
            {allTopNotes.map((n, i) => (
              <NoteChip key={i} note={n} layer="top" />
            ))}
            {(fragrance.topNotes || []).length > 3 && (
              <span className={styles.more}>+{fragrance.topNotes.length - 3}</span>
            )}
          </div>
        )}

        {fragrance.personalNotes && (
          <p className={styles.personalNote}>{fragrance.personalNotes}</p>
        )}
      </div>

      {isSelected && <div className={styles.selectedIndicator} />}
    </button>
  )
}
