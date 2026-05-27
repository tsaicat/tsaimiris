import React, { useState, useEffect, useCallback } from 'react'
import { getCollection, saveCollection, generateId } from './utils/storage'
import { SEED_FRAGRANCES } from './data/seedData'
import HomePage from './components/HomePage'
import ShelfView from './components/ShelfView'
import WishlistView from './components/WishlistView'
import FragranceDetail from './components/FragranceDetail'
import FragranceForm from './components/FragranceForm'
import styles from './App.module.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'collection', label: 'Collection', icon: '🌸' },
  { id: 'wishlist', label: 'Wishlist', icon: '✦' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [fragrances, setFragrances] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formDefaultStatus, setFormDefaultStatus] = useState('owned')

  // Load from localStorage, seed if empty
  useEffect(() => {
    const stored = getCollection()
    if (stored && stored.length > 0) {
      setFragrances(stored)
    } else {
      setFragrances(SEED_FRAGRANCES)
      saveCollection(SEED_FRAGRANCES)
    }
  }, [])

  const persist = useCallback((updated) => {
    setFragrances(updated)
    saveCollection(updated)
  }, [])

  function handleSave(fragrance) {
    const exists = fragrances.find(f => f.id === fragrance.id)
    let updated
    if (exists) {
      updated = fragrances.map(f => f.id === fragrance.id ? fragrance : f)
    } else {
      updated = [...fragrances, fragrance]
    }
    persist(updated)
    setShowForm(false)
    setEditTarget(null)
    setSelected(fragrance)
  }

  function handleDelete(id) {
    if (!window.confirm('Remove this fragrance?')) return
    const updated = fragrances.filter(f => f.id !== id)
    persist(updated)
    setSelected(null)
  }

  function handleEdit(fragrance) {
    setEditTarget(fragrance)
    setShowForm(true)
  }

  function handleMoveTo(fragrance) {
    const newStatus = fragrance.status === 'owned' ? 'wishlist' : 'owned'
    const updated = fragrances.map(f => f.id === fragrance.id ? { ...f, status: newStatus } : f)
    persist(updated)
    setSelected({ ...fragrance, status: newStatus })
    if (newStatus === 'wishlist') setTab('wishlist')
    else setTab('collection')
  }

  function openAddForm(defaultStatus) {
    setEditTarget(null)
    setFormDefaultStatus(defaultStatus || 'owned')
    setShowForm(true)
  }

  function handleTabSelect(f) {
    setSelected(f)
  }

  return (
    <div className={styles.app}>
      {/* Sidebar nav */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <svg viewBox="0 0 32 48" fill="none" className={styles.navLogoSvg}>
            <rect x="6" y="14" width="20" height="28" rx="4" fill="url(#navG)" />
            <rect x="10" y="8" width="12" height="8" rx="2.5" fill="#C4A04A" />
            <rect x="13" y="4" width="6" height="6" rx="1.5" fill="#9A7A38" />
            <defs>
              <linearGradient id="navG" x1="6" y1="14" x2="26" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D4B86A" /><stop offset="1" stopColor="#8B6F47" />
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.navTitle}>TsaiMiris</span>
        </div>

        <div className={styles.navItems}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${tab === item.id ? styles.navActive : ''}`}
              onClick={() => { setTab(item.id); setSelected(null) }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.id === 'collection' && (
                <span className={styles.navBadge}>{fragrances.filter(f=>f.status==='owned').length}</span>
              )}
              {item.id === 'wishlist' && fragrances.filter(f=>f.status==='wishlist').length > 0 && (
                <span className={styles.navBadge}>{fragrances.filter(f=>f.status==='wishlist').length}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.navFooter}>
          <span className={styles.navFooterText}>
            {fragrances.filter(f=>f.status==='owned').length} fragrances
          </span>
        </div>
      </nav>

      {/* Main area */}
      <main className={styles.main}>
        <div className={`${styles.content} ${selected && tab !== 'home' ? styles.contentSplit : ''}`}>
          <div className={styles.left}>
            {tab === 'home' && (
              <HomePage fragrances={fragrances} onNavigate={id => { setTab(id); setSelected(null) }} />
            )}
            {tab === 'collection' && (
              <ShelfView
                fragrances={fragrances}
                selected={selected}
                onSelect={handleTabSelect}
                onAdd={() => openAddForm('owned')}
              />
            )}
            {tab === 'wishlist' && (
              <WishlistView
                fragrances={fragrances}
                selected={selected}
                onSelect={handleTabSelect}
                onAdd={() => openAddForm('wishlist')}
              />
            )}
          </div>

          {selected && tab !== 'home' && (
            <div className={styles.right}>
              <FragranceDetail
                fragrance={selected}
                allFragrances={fragrances}
                onClose={() => setSelected(null)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMoveTo={handleMoveTo}
              />
            </div>
          )}
        </div>
      </main>

      {/* Bottom nav for mobile */}
      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.bottomNavItem} ${tab === item.id ? styles.bottomNavActive : ''}`}
            onClick={() => { setTab(item.id); setSelected(null) }}
          >
            <span className={styles.bottomNavIcon}>{item.icon}</span>
            <span className={styles.bottomNavLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal form */}
      {showForm && (
        <FragranceForm
          initial={editTarget}
          defaultStatus={formDefaultStatus}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
    </div>
  )
}
