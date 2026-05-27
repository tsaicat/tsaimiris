import React from 'react'
import NoteChip from './NoteChip'
import styles from './NotesPyramid.module.css'

export default function NotesPyramid({ topNotes = [], middleNotes = [], baseNotes = [] }) {
  return (
    <div className={styles.pyramid}>
      <h3 className={styles.title}>Notes Pyramid</h3>

      <div className={styles.layer}>
        <div className={styles.layerHeader}>
          <span className={styles.layerIcon}>▲</span>
          <span className={styles.layerName}>Top Notes</span>
          <span className={styles.layerSub}>First impression</span>
        </div>
        <div className={styles.chips}>
          {topNotes.length > 0
            ? topNotes.map((n, i) => <NoteChip key={i} note={n} layer="top" />)
            : <span className={styles.empty}>—</span>
          }
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.layer}>
        <div className={styles.layerHeader}>
          <span className={styles.layerIcon}>◆</span>
          <span className={styles.layerName}>Middle Notes</span>
          <span className={styles.layerSub}>Heart of the fragrance</span>
        </div>
        <div className={styles.chips}>
          {middleNotes.length > 0
            ? middleNotes.map((n, i) => <NoteChip key={i} note={n} layer="middle" />)
            : <span className={styles.empty}>—</span>
          }
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.layer}>
        <div className={styles.layerHeader}>
          <span className={styles.layerIcon}>▼</span>
          <span className={styles.layerName}>Base Notes</span>
          <span className={styles.layerSub}>The lasting impression</span>
        </div>
        <div className={styles.chips}>
          {baseNotes.length > 0
            ? baseNotes.map((n, i) => <NoteChip key={i} note={n} layer="base" />)
            : <span className={styles.empty}>—</span>
          }
        </div>
      </div>
    </div>
  )
}
