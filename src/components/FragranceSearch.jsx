import React, { useState, useEffect, useRef, useCallback } from 'react'
import { loadIndex, searchIndex, getFragranceByIndex } from '../utils/fragranceDB'
import styles from './FragranceSearch.module.css'

export default function FragranceSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [indexState, setIndexState] = useState('idle') // idle | loading | ready | error
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)

  // Load index on mount
  useEffect(() => {
    setIndexState('loading')
    loadIndex()
      .then(() => setIndexState('ready'))
      .catch(() => setIndexState('error'))
  }, [])

  const doSearch = useCallback((q) => {
    if (!q.trim() || indexState !== 'ready') {
      setResults([])
      setOpen(false)
      return
    }
    const hits = searchIndex(q, 12)
    setResults(hits)
    setOpen(hits.length > 0)
  }, [indexState])

  function handleInput(val) {
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 150)
  }

  async function handleSelect(hit) {
    setLoading(true)
    setOpen(false)
    setQuery(`${hit.name} — ${hit.brand}`)
    try {
      const full = await getFragranceByIndex(hit.idx)
      if (full) onSelect(full)
    } catch {
      // fallback: pass what we have from index
      onSelect({ name: hit.name, brand: hit.brand, topNotes: [], middleNotes: [], baseNotes: [] })
    }
    setLoading(false)
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder={
            indexState === 'loading' ? 'Loading fragrance database...' :
            indexState === 'error' ? 'Database unavailable' :
            'Search 69,000+ fragrances...'
          }
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          disabled={indexState === 'loading'}
          autoComplete="off"
        />
        {loading && <span className={styles.spinner}>⟳</span>}
        {query && !loading && (
          <button className={styles.clear} onClick={() => { setQuery(''); setResults([]); setOpen(false) }}>✕</button>
        )}
        {indexState === 'ready' && !query && (
          <span className={styles.dbBadge}>69k</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {results.map((hit, i) => (
            <button
              key={i}
              className={styles.result}
              onClick={() => handleSelect(hit)}
            >
              <span className={styles.resultName}>{hit.name}</span>
              <span className={styles.resultBrand}>{hit.brand}</span>
            </button>
          ))}
          <div className={styles.hint}>Click to auto-fill notes</div>
        </div>
      )}
    </div>
  )
}
