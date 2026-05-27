import React from 'react'
import { getNoteIcon } from '../utils/noteIcons'
import styles from './NoteChip.module.css'

export default function NoteChip({ note, layer }) {
  const icon = getNoteIcon(note)
  return (
    <span className={`${styles.chip} ${styles[layer] || ''}`} title={note}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{note}</span>
    </span>
  )
}
