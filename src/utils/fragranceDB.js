/**
 * Fragrance database loader.
 *
 * The database JSON files live inside src/data/fragrance so Vite includes them
 * in the built app instead of relying on public file paths.
 *
 * Index format: [[name, brand, dataIndex], ...]
 * Data format:  [[name, brand, top[], mid[], base[], url, rating, year, gender], ...]
 */

const CHUNK_SIZE = 5000

let indexData = null
let indexPromise = null
const chunkCache = {}

const fragranceJsonModules = import.meta.glob('../data/fragrance/*.json')

async function loadJson(relativePath) {
  const loader = fragranceJsonModules[relativePath]

  if (!loader) {
    throw new Error(`Fragrance database file not found: ${relativePath}`)
  }

  const module = await loader()
  return module.default
}

export async function loadIndex() {
  if (indexData) return indexData
  if (indexPromise) return indexPromise

  indexPromise = loadJson('../data/fragrance/fragrance_index.json')
    .then(data => {
      indexData = data
      return data
    })
    .catch(error => {
      indexPromise = null
      throw error
    })

  return indexPromise
}

async function loadChunk(chunkIndex) {
  if (chunkCache[chunkIndex]) return chunkCache[chunkIndex]

  const data = await loadJson(`../data/fragrance/fragrance_data_${chunkIndex}.json`)
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
