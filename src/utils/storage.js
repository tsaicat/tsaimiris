const COLLECTION_KEY = 'tsaimiris_collection'
const WISHLIST_KEY = 'tsaimiris_wishlist'

export function getCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCollection(items) {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(items))
}

export function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
