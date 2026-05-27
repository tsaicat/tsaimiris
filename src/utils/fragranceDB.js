/**
 * Fragrance database loader.
 * Index (~3.2 MB) loads on first search.
 * Data is split into 14 chunks of ~1.2 MB each -- only the relevant chunk loads per lookup.
 *
 * Index format: [[name, brand, dataIndex], ...]
 * Data format:  [[name, brand, top[], mid[], base[], url, rating, year, gender], ...]
 */

const CHUNK_SIZE = 5000
const TOTAL_CHUNKS = 14

let indexData = null
let indexLoading = false
let indexPromise = null
const chunkCache = {}

export async function loadIndex() {
  if (indexData) return indexData
  if (indexPromise) return indexPromise
  indexLoading = true
  indexPromise = fetch(`${import.meta.env.BASE_URL}fragrance_index.json`)
    .then(r => { if (!r.ok) throw new Error('Index load failed'); return r.json() })
    .then(data => { indexData = data; indexLoading = false; return data })
    .catch(err => { indexLoading = false; indexPromise = null; throw err })
  return indexPromise
}

async function loadChunk(chunkIndex) {
  if (chunkCache[chunkIndex]) return chunkCache[chunkIndex]
  const res = await fetch(`${import.meta.env.BASE_URL}fragrance_data_${chunkIndex}.json`)
  if (!res.ok) throw new Error(`Chunk ${chunkIndex} load failed`)
  const data = await res.json()
  chunkCache[chunkIndex] = data
  return data
}

export function searchIndex(query, limit = 12) {
  if (!indexData || !query.trim()) return []
  const q = query.toLowerCase().trim()
  const results = []
  for (const entry of indexData) {
    const name = entry[0].toLowerCase()
    const brand = entry[1].toLowerCase()
    if (name.includes(q) || brand.includes(q)) {
      results.push({ name: entry[0], brand: entry[1], idx: entry[2] })
      if (results.length >= limit) break
    }
  }
  return results
}

export async function getFragranceByIndex(idx) {
  const chunkIndex = Math.floor(idx / CHUNK_SIZE)
  const localIndex = idx % CHUNK_SIZE
  const chunk = await loadChunk(chunkIndex)
  const row = chunk[localIndex]
  if (!row) return null
  return {
    name: row[0],
    brand: row[1],
    topNotes: row[2] || [],
    middleNotes: row[3] || [],
    baseNotes: row[4] || [],
    url: row[5] || '',
    rating: parseFloat(row[6]) || null,
    year: row[7] || '',
    gender: row[8] || '',
  }
}
