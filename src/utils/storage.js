const COLLECTION_KEY = 'tsaimiris_collection'
const LIBRARY_KEY = 'tsaimiris_library_v2'

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function normalizeFragrance(item) {
  return {
    ...item,
    id: item.id || generateId(),
    status: item.status || 'owned',
    topNotes: item.topNotes || [],
    middleNotes: item.middleNotes || [],
    baseNotes: item.baseNotes || [],
  }
}

export function createCollection(name = 'My Collection', type = 'friend', fragrances = []) {
  return {
    id: generateId(),
    name: name.trim() || 'Untitled Collection',
    type,
    fragrances: fragrances.map(normalizeFragrance),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function getCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY)
    return safeParse(raw, [])
  } catch {
    return []
  }
}

export function saveCollection(items) {
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}

export function getLibrary() {
  try {
    const stored = safeParse(localStorage.getItem(LIBRARY_KEY), null)
    if (stored?.collections?.length) return stored

    const legacy = getCollection()
    const ownCollection = createCollection('My Collection', 'me', legacy)
    return {
      activeCollectionId: ownCollection.id,
      collections: [ownCollection],
    }
  } catch {
    const fallback = createCollection('My Collection', 'me', [])
    return { activeCollectionId: fallback.id, collections: [fallback] }
  }
}

export function saveLibrary(library) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library))
    const own = library.collections.find(c => c.type === 'me') || library.collections[0]
    if (own) saveCollection(own.fragrances || [])
    return true
  } catch {
    return false
  }
}

export function exportCollectionPayload(collection) {
  return {
    schema: 'tsaimiris.collection.export',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    collection: {
      id: collection.id,
      name: collection.name,
      type: collection.type || 'friend',
      fragrances: (collection.fragrances || []).map(normalizeFragrance),
    },
  }
}

export function normalizeImportedCollection(payload) {
  const source = payload?.collection || payload
  if (!source || !Array.isArray(source.fragrances)) {
    throw new Error('This file does not look like a TsaiMiris collection export.')
  }

  return createCollection(
    source.name || 'Imported Collection',
    source.type === 'me' ? 'friend' : (source.type || 'friend'),
    source.fragrances
  )
}
