/**
 * Calculates fragrance similarity based on shared notes.
 * Same-layer matches score higher than cross-layer matches.
 */

function normalizeNote(note) {
  return note.toLowerCase().trim()
}

function notesMatch(a, b) {
  const na = normalizeNote(a)
  const nb = normalizeNote(b)
  if (na === nb) return true
  // partial containment for compound notes like "white musk" vs "musk"
  if (na.includes(nb) || nb.includes(na)) return true
  return false
}

function countMatches(setA, setB) {
  let count = 0
  for (const a of setA) {
    for (const b of setB) {
      if (notesMatch(a, b)) { count++; break }
    }
  }
  return count
}

export function calculateSimilarity(target, candidate) {
  const tTop = (target.topNotes || []).map(normalizeNote)
  const tMid = (target.middleNotes || []).map(normalizeNote)
  const tBase = (target.baseNotes || []).map(normalizeNote)

  const cTop = (candidate.topNotes || []).map(normalizeNote)
  const cMid = (candidate.middleNotes || []).map(normalizeNote)
  const cBase = (candidate.baseNotes || []).map(normalizeNote)

  const tAll = [...tTop, ...tMid, ...tBase]
  const cAll = [...cTop, ...cMid, ...cBase]

  if (tAll.length === 0 || cAll.length === 0) return 0

  // Weights: same-layer = 3 pts, cross-layer = 1 pt
  let score = 0
  let maxPossible = 0

  // Same-layer scoring
  score += countMatches(tTop, cTop) * 3
  score += countMatches(tMid, cMid) * 3
  score += countMatches(tBase, cBase) * 3

  // Cross-layer scoring (only unique matches not already counted same-layer)
  const allTargetNotes = [...new Set(tAll)]
  const allCandidateNotes = [...new Set(cAll)]

  // find cross-layer matches (notes that match but not in same layer)
  for (const tn of allTargetNotes) {
    for (const cn of allCandidateNotes) {
      if (!notesMatch(tn, cn)) continue
      // check if this pair was already counted as same-layer
      const isSameLayer =
        (tTop.includes(tn) && cTop.includes(cn)) ||
        (tMid.includes(tn) && cMid.includes(cn)) ||
        (tBase.includes(tn) && cBase.includes(cn))
      if (!isSameLayer) {
        score += 1
      }
    }
  }

  // Max possible score = all target notes match same-layer
  maxPossible = allTargetNotes.length * 3

  if (maxPossible === 0) return 0

  const raw = Math.min(score / maxPossible, 1)
  return Math.round(raw * 100)
}

export function getSimilarFragrances(target, allFragrances) {
  return allFragrances
    .filter(f => f.id !== target.id)
    .map(f => ({
      fragrance: f,
      similarity: calculateSimilarity(target, f)
    }))
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
}
