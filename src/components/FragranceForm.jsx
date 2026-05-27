import React, { useState, useEffect } from 'react'
import { generateId } from '../utils/storage'
import { NOTE_CATEGORIES } from '../utils/noteIcons'
import NoteChip from './NoteChip'
import FragranceSearch from './FragranceSearch'
import styles from './FragranceForm.module.css'

const EMPTY = {
  name: '', brand: '', topNotes: [], middleNotes: [], baseNotes: [],
  personalNotes: '', rating: null, image: null, status: 'owned',
  _imageUrl: ''
}

function NoteInput({ label, layer, notes, setNotes }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])

  function handleInput(val) {
    setInput(val)
    if (val.length >= 2) {
      const q = val.toLowerCase()
      setSuggestions(NOTE_CATEGORIES.filter(n => n.includes(q) && !notes.includes(n)).slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  function addNote(note) {
    const clean = note.trim().toLowerCase()
    if (clean && !notes.includes(clean)) setNotes([...notes, clean])
    setInput('')
    setSuggestions([])
  }

  function removeNote(note) { setNotes(notes.filter(n => n !== note)) }

  function handleKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addNote(input)
    }
  }

  return (
    <div className={styles.noteInput}>
      <label className={styles.noteLabel}>{label}</label>
      <div className={styles.chipRow}>
        {notes.map((n, i) => (
          <span key={i} className={styles.chipWrap}>
            <NoteChip note={n} layer={layer} />
            <button className={styles.removeChip} onClick={() => removeNote(n)} title="Remove">✕</button>
          </span>
        ))}
      </div>
      <div className={styles.noteInputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Type note, press Enter..."
          value={input}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={handleKey}
        />
        {input.trim() && (
          <button className={styles.addBtn} onClick={() => addNote(input)}>Add</button>
        )}
      </div>
      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map(s => (
            <button key={s} className={styles.suggestion} onClick={() => addNote(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FragranceForm({ initial, onSave, onCancel, defaultStatus }) {
  const [data, setData] = useState({ ...EMPTY, status: defaultStatus || 'owned', ...(initial || {}) })

  useEffect(() => {
    if (initial) setData({ ...EMPTY, status: defaultStatus || 'owned', ...initial })
  }, [initial])

  function set(key, val) { setData(d => ({ ...d, [key]: val })) }
  function setMany(obj) { setData(d => ({ ...d, ...obj })) }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('image', ev.target.result)
    reader.readAsDataURL(file)
  }

  async function handleImageUrlLoad() {
    const url = (data._imageUrl || '').trim()
    if (!url) return
    try {
      const proxy = 'https://corsproxy.io/?' + encodeURIComponent(url)
      const res = await fetch(proxy)
      const blob = await res.blob()
      const reader = new FileReader()
      reader.onload = ev => set('image', ev.target.result)
      reader.readAsDataURL(blob)
    } catch {
      set('image', url)
    }
  }

  function handleSave() {
    if (!data.name.trim() || !data.brand.trim()) return
    const fragrance = { ...data, id: data.id || generateId() }
    onSave(fragrance)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{initial ? 'Edit Fragrance' : 'Add Fragrance'}</h2>
          <button className={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>

        <div className={styles.body}>

          {/* === DATABASE SEARCH === */}
          <div className={styles.dbSearchBox}>
            <div className={styles.autofillHeader}>
              <span className={styles.autofillIcon}>🗄</span>
              <span className={styles.autofillTitle}>Search Fragrance Database</span>
            </div>
            <p className={styles.autofillHint}>
              Search 69,000+ fragrances. Select one to auto-fill name, brand, and all notes instantly.
            </p>
            <FragranceSearch onSelect={result => {
              setMany({
                name: result.name || data.name,
                brand: result.brand || data.brand,
                topNotes: result.topNotes.length > 0 ? result.topNotes : data.topNotes,
                middleNotes: result.middleNotes.length > 0 ? result.middleNotes : data.middleNotes,
                baseNotes: result.baseNotes.length > 0 ? result.baseNotes : data.baseNotes,
              })
            }} />
          </div>

          {/* === MANUAL FIELDS === */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Fragrance Name *</label>
              <input className={styles.input} value={data.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Black Orchid" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Brand *</label>
              <input className={styles.input} value={data.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Tom Ford" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={data.status} onChange={e => set('status', e.target.value)}>
                <option value="owned">Owned</option>
                <option value="wishlist">Wishlist</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Rating</label>
              <div className={styles.ratingRow}>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    className={`${styles.starBtn} ${n <= (data.rating || 0) ? styles.starActive : ''}`}
                    onClick={() => set('rating', data.rating === n ? null : n)}
                  >★</button>
                ))}
              </div>
            </div>
          </div>

          <NoteInput label="Top Notes" layer="top" notes={data.topNotes} setNotes={v => set('topNotes', v)} />
          <NoteInput label="Middle / Heart Notes" layer="middle" notes={data.middleNotes} setNotes={v => set('middleNotes', v)} />
          <NoteInput label="Base Notes" layer="base" notes={data.baseNotes} setNotes={v => set('baseNotes', v)} />

          <div className={styles.field}>
            <label className={styles.label}>Personal Notes</label>
            <textarea
              className={styles.textarea}
              value={data.personalNotes}
              onChange={e => set('personalNotes', e.target.value)}
              placeholder="Your thoughts, when you wear it, occasions..."
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Image — Upload or URL</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
            <div className={styles.urlRow}>
              <input
                className={styles.input}
                type="url"
                placeholder="Or paste direct image URL..."
                value={data._imageUrl || ''}
                onChange={e => set('_imageUrl', e.target.value)}
              />
              <button className={styles.addBtn} onClick={handleImageUrlLoad}>Load</button>
            </div>
            {data.image && <img src={data.image} alt="preview" className={styles.preview} />}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!data.name.trim() || !data.brand.trim()}
          >
            {initial ? 'Save Changes' : 'Add to Collection'}
          </button>
        </div>
      </div>
    </div>
  )
}
