import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  createCollection,
  exportCollectionPayload,
  generateId,
  getLibrary,
  normalizeImportedCollection,
  saveLibrary,
} from './utils/storage'
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

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function fileSafeName(name) {
  return (name || 'collection').toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'collection'
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [library, setLibrary] = useState({ activeCollectionId: null, collections: [] })
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formDefaultStatus, setFormDefaultStatus] = useState('owned')
  const importInputRef = useRef(null)

  useEffect(() => {
    const stored = getLibrary()

    if (stored.collections.length === 1 && stored.collections[0].fragrances.length === 0) {
      const seeded = {
        ...stored,
        collections: [{ ...stored.collections[0], fragrances: SEED_FRAGRANCES, updatedAt: new Date().toISOString() }],
      }
      setLibrary(seeded)
      saveLibrary(seeded)
      return
    }

    setLibrary(stored)
    saveLibrary(stored)
  }, [])

  const activeCollection = useMemo(() => {
    return library.collections.find(c => c.id === library.activeCollectionId) || library.collections[0] || createCollection('My Collection', 'me', [])
  }, [library])

  const fragrances = activeCollection.fragrances || []
  const ownedCount = fragrances.filter(f => f.status === 'owned').length
  const wishlistCount = fragrances.filter(f => f.status === 'wishlist').length

  const persistLibrary = useCallback((updatedLibrary) => {
    setLibrary(updatedLibrary)
    saveLibrary(updatedLibrary)
  }, [])

  const updateActiveCollection = useCallback((updater) => {
    const updatedCollections = library.collections.map(collection => {
      if (collection.id !== activeCollection.id) return collection
      const updated = typeof updater === 'function' ? updater(collection) : { ...collection, ...updater }
      return { ...updated, updatedAt: new Date().toISOString() }
    })

    persistLibrary({ ...library, collections: updatedCollections })
  }, [activeCollection.id, library, persistLibrary])

  function persistFragrances(updated) {
    updateActiveCollection(collection => ({ ...collection, fragrances: updated }))
  }

  function handleSave(fragrance) {
    const prepared = { ...fragrance, id: fragrance.id || generateId() }
    const exists = fragrances.find(f => f.id === prepared.id)
    const updated = exists
      ? fragrances.map(f => f.id === prepared.id ? prepared : f)
      : [...fragrances, prepared]

    persistFragrances(updated)
    setShowForm(false)
    setEditTarget(null)
    setSelected(prepared)
  }

  function handleDelete(id) {
    if (!window.confirm('Remove this fragrance?')) return
    const updated = fragrances.filter(f => f.id !== id)
    persistFragrances(updated)
    setSelected(null)
  }

  function handleEdit(fragrance) {
    setEditTarget(fragrance)
    setShowForm(true)
  }

  function handleMoveTo(fragrance) {
    const newStatus = fragrance.status === 'owned' ? 'wishlist' : 'owned'
    const moved = { ...fragrance, status: newStatus }
    const updated = fragrances.map(f => f.id === fragrance.id ? moved : f)
    persistFragrances(updated)
    setSelected(moved)
    setTab(newStatus === 'wishlist' ? 'wishlist' : 'collection')
  }

  function openAddForm(defaultStatus) {
    setEditTarget(null)
    setFormDefaultStatus(defaultStatus || 'owned')
    setShowForm(true)
  }

  function handleCollectionSwitch(id) {
    persistLibrary({ ...library, activeCollectionId: id })
    setSelected(null)
    setTab('collection')
  }

  function handleRenameCollection() {
    const nextName = window.prompt('Collection name:', activeCollection.name)
    if (!nextName || !nextName.trim()) return
    updateActiveCollection(collection => ({ ...collection, name: nextName.trim() }))
  }

  function handleAddFriendCollection() {
    const name = window.prompt('Friend collection name:', 'Friend Collection')
    if (!name || !name.trim()) return
    const friend = createCollection(name.trim(), 'friend', [])
    persistLibrary({
      activeCollectionId: friend.id,
      collections: [...library.collections, friend],
    })
    setSelected(null)
    setTab('collection')
  }

  function handleDeleteCollection() {
    if (activeCollection.type === 'me') return
    if (!window.confirm(`Delete ${activeCollection.name}? This only removes it from this browser.`)) return

    const collections = library.collections.filter(c => c.id !== activeCollection.id)
    const fallback = collections[0] || createCollection('My Collection', 'me', [])
    persistLibrary({ activeCollectionId: fallback.id, collections: collections.length ? collections : [fallback] })
    setSelected(null)
    setTab('collection')
  }

  function handleExportCollection() {
    downloadJson(
      `tsaimiris-${fileSafeName(activeCollection.name)}.json`,
      exportCollectionPayload(activeCollection)
    )
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const payload = JSON.parse(text)
      const imported = normalizeImportedCollection(payload)
      persistLibrary({
        activeCollectionId: imported.id,
        collections: [...library.collections, imported],
      })
      setSelected(null)
      setTab('collection')
    } catch (error) {
      window.alert(error.message || 'Could not import this collection file.')
    }
  }

  return (
    <div className={styles.app}>
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

        <div className={styles.collectionSwitcher}>
          <div className={styles.switcherHeader}>
            <span>Collections</span>
            <button className={styles.tinyIconBtn} onClick={handleAddFriendCollection} title="Add friend collection">+</button>
          </div>
          <div className={styles.collectionTabs}>
            {library.collections.map(collection => {
              const count = (collection.fragrances || []).filter(f => f.status === 'owned').length
              return (
                <button
                  key={collection.id}
                  className={`${styles.collectionTab} ${activeCollection.id === collection.id ? styles.collectionTabActive : ''}`}
                  onClick={() => handleCollectionSwitch(collection.id)}
                >
                  <span className={styles.collectionAvatar}>{collection.type === 'me' ? '♛' : '♡'}</span>
                  <span className={styles.collectionName}>{collection.name}</span>
                  <span className={styles.collectionCount}>{count}</span>
                </button>
              )
            })}
          </div>
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
              {item.id === 'collection' && <span className={styles.navBadge}>{ownedCount}</span>}
              {item.id === 'wishlist' && wishlistCount > 0 && <span className={styles.navBadge}>{wishlistCount}</span>}
            </button>
          ))}
        </div>

        <div className={styles.navFooter}>
          <span className={styles.navFooterText}>{ownedCount} fragrances in {activeCollection.name}</span>
          <div className={styles.footerActions}>
            <button onClick={handleRenameCollection}>Rename</button>
            <button onClick={handleExportCollection}>Export JSON</button>
            <button onClick={() => importInputRef.current?.click()}>Import JSON</button>
            {activeCollection.type !== 'me' && <button onClick={handleDeleteCollection}>Delete Friend</button>}
          </div>
          <input
            ref={importInputRef}
            className={styles.hiddenInput}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
          />
        </div>
      </nav>

      <main className={styles.main}>
        <div className={`${styles.content} ${selected && tab !== 'home' ? styles.contentSplit : ''}`}>
          <div className={styles.left}>
            {tab === 'home' && (
              <HomePage fragrances={fragrances} onNavigate={id => { setTab(id); setSelected(null) }} />
            )}
            {tab === 'collection' && (
              <ShelfView
                fragrances={fragrances}
                collectionName={activeCollection.name}
                selected={selected}
                onSelect={setSelected}
                onAdd={() => openAddForm('owned')}
              />
            )}
            {tab === 'wishlist' && (
              <WishlistView
                fragrances={fragrances}
                collectionName={activeCollection.name}
                selected={selected}
                onSelect={setSelected}
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
