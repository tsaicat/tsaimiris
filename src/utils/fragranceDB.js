/**
 * Fragrance database loader.
 */

import fragranceIndex from '../data/fragrance/fragrance_index.json'

import fragranceData0 from '../data/fragrance/fragrance_data_0.json'
import fragranceData1 from '../data/fragrance/fragrance_data_1.json'
import fragranceData2 from '../data/fragrance/fragrance_data_2.json'
import fragranceData3 from '../data/fragrance/fragrance_data_3.json'
import fragranceData4 from '../data/fragrance/fragrance_data_4.json'
import fragranceData5 from '../data/fragrance/fragrance_data_5.json'
import fragranceData6 from '../data/fragrance/fragrance_data_6.json'
import fragranceData7 from '../data/fragrance/fragrance_data_7.json'
import fragranceData8 from '../data/fragrance/fragrance_data_8.json'
import fragranceData9 from '../data/fragrance/fragrance_data_9.json'
import fragranceData10 from '../data/fragrance/fragrance_data_10.json'
import fragranceData11 from '../data/fragrance/fragrance_data_11.json'
import fragranceData12 from '../data/fragrance/fragrance_data_12.json'
import fragranceData13 from '../data/fragrance/fragrance_data_13.json'

const CHUNK_SIZE = 5000

let indexData = fragranceIndex

const chunkCache = {
  0: fragranceData0,
  1: fragranceData1,
  2: fragranceData2,
  3: fragranceData3,
  4: fragranceData4,
  5: fragranceData5,
  6: fragranceData6,
  7: fragranceData7,
  8: fragranceData8,
  9: fragranceData9,
  10: fragranceData10,
  11: fragranceData11,
  12: fragranceData12,
  13: fragranceData13,
}

export async function loadIndex() {
  return indexData
}

async function loadChunk(chunkIndex) {
  return chunkCache[chunkIndex] || []
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