import React, { useState, useMemo } from 'react'
import FragranceCard from './FragranceCard'
import SearchSortControls from './SearchSortControls'
import styles from './ShelfView.module.css'

export default function ShelfView({ fragrances, selected, onSelect, onAdd }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterNote, setFilterNote] = useState('')

  const filtered = useMemo(() => {
    let list = fragrances.filter(f => f.status === 'owned')

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.brand.toLowerCase().includes(q)
      )
    }

    if (filterNote.trim()) {
      const q = filterNote.toLowerCase()
      list = list.filter(f => {
        const allNotes = [...(f.topNotes||[]), ...(f.middleNotes||[]), ...(f.baseNotes||[])]
        return allNotes.some(n => n.toLowerCase().includes(q))
      })
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'brand') return a.brand.localeCompare(b.brand)
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      return a.name.localeCompare(b.name)
    })

    return list
  }, [fragrances, search, sortBy, filterNote])

  return (
    <div className={styles.shelf}>
      <div className={styles.shelfHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>My Collection</h2>
          <span className={styles.count}>{fragrances.filter(f=>f.status==='owned').length} fragrances</span>
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          <span>+</span> Add Fragrance
        </button>
      </div>

      <SearchSortControls
        search={search} setSearch={setSearch}
        sortBy={sortBy} setSortBy={setSortBy}
        filterNote={filterNote} setFilterNote={setFilterNote}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🌸</span>
          <p>No fragrances found</p>
          {fragrances.filter(f=>f.status==='owned').length === 0 && (
            <button className={styles.emptyAdd} onClick={onAdd}>Add your first fragrance</button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(f => (
            <FragranceCard
              key={f.id}
              fragrance={f}
              isSelected={selected && selected.id === f.id}
              onClick={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
