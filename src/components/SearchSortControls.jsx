import React from 'react'
import styles from './SearchSortControls.module.css'

export default function SearchSortControls({ search, setSearch, sortBy, setSortBy, filterNote, setFilterNote }) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.search}
          type="text"
          placeholder="Search name or brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clear} onClick={() => setSearch('')} title="Clear">✕</button>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Sort: Name</option>
            <option value="brand">Sort: Brand</option>
            <option value="rating">Sort: Rating</option>
          </select>
        </div>

        <div className={styles.selectWrap}>
          <input
            className={styles.noteFilter}
            type="text"
            placeholder="Filter by note..."
            value={filterNote}
            onChange={e => setFilterNote(e.target.value)}
          />
          {filterNote && (
            <button className={styles.clear} onClick={() => setFilterNote('')} title="Clear">✕</button>
          )}
        </div>
      </div>
    </div>
  )
}
