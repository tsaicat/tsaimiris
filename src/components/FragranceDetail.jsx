import React from 'react'
import NotesPyramid from './NotesPyramid'
import SimilarityTable from './SimilarityTable'
import { getSimilarFragrances } from '../utils/similarity'
import styles from './FragranceDetail.module.css'

const STARS = [1,2,3,4,5]

export default function FragranceDetail({ fragrance, allFragrances, onClose, onEdit, onDelete, onMoveTo }) {
  if (!fragrance) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🌸</div>
        <p className={styles.emptyText}>Select a fragrance to see details</p>
      </div>
    )
  }

  const owned = allFragrances.filter(f => f.status === 'owned')
  const similar = getSimilarFragrances(fragrance, owned)
  const isWishlist = fragrance.status === 'wishlist'

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.bottleWrap}>
          {fragrance.image ? (
            <img src={fragrance.image} alt={fragrance.name} className={styles.bottleImage} />
          ) : (
            <svg viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.bottleSvg}>
              <rect x="16" y="30" width="32" height="64" rx="8" fill="url(#dGrad)" />
              <rect x="20" y="18" width="24" height="14" rx="4" fill="url(#dNeck)" />
              <rect x="26" y="10" width="12" height="10" rx="3" fill="#C4A04A" />
              <rect x="22" y="45" width="20" height="2.5" rx="1.25" fill="white" fillOpacity="0.35" />
              <rect x="22" y="56" width="14" height="1.5" rx="0.75" fill="white" fillOpacity="0.2" />
              <rect x="22" y="64" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.15" />
              <defs>
                <linearGradient id="dGrad" x1="16" y1="30" x2="48" y2="94" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E8CFA0" />
                  <stop offset="50%" stopColor="#C4A04A" />
                  <stop offset="100%" stopColor="#7A5828" />
                </linearGradient>
                <linearGradient id="dNeck" x1="20" y1="18" x2="44" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4B86A" />
                  <stop offset="100%" stopColor="#9A7A38" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        <div className={styles.meta}>
          <span className={styles.brand}>{fragrance.brand}</span>
          <h2 className={styles.name}>{fragrance.name}</h2>
          {fragrance.rating && (
            <div className={styles.stars}>
              {STARS.map(s => (
                <span key={s} className={s <= fragrance.rating ? styles.starOn : styles.starOff}>★</span>
              ))}
            </div>
          )}
          {isWishlist && (
            <span className={styles.wishlistBadge}>✦ Wishlist</span>
          )}
          {fragrance.personalNotes && (
            <p className={styles.personalNote}>"{fragrance.personalNotes}"</p>
          )}
        </div>
        <button className={styles.closeBtn} onClick={onClose} title="Close panel">✕</button>
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(fragrance)}>Edit</button>
        {isWishlist && (
          <button className={styles.moveBtn} onClick={() => onMoveTo(fragrance)}>
            Move to Collection
          </button>
        )}
        {!isWishlist && (
          <button className={styles.moveBtn} onClick={() => onMoveTo(fragrance)}>
            Move to Wishlist
          </button>
        )}
        <button className={styles.deleteBtn} onClick={() => onDelete(fragrance.id)}>Delete</button>
      </div>

      <div className={styles.sections}>
        <NotesPyramid
          topNotes={fragrance.topNotes}
          middleNotes={fragrance.middleNotes}
          baseNotes={fragrance.baseNotes}
        />
        <SimilarityTable results={similar} />
      </div>
    </div>
  )
}
