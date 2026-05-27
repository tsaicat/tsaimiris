export const NOTE_ICONS = {
  // Florals
  rose: '🌹',
  jasmine: '🌸',
  lily: '🌷',
  peony: '🌺',
  violet: '💜',
  iris: '💐',
  tuberose: '🌼',
  ylang: '🌻',
  geranium: '🌿',
  neroli: '🍊',
  // Citrus
  citrus: '🍋',
  lemon: '🍋',
  bergamot: '🟡',
  orange: '🍊',
  grapefruit: '🍊',
  lime: '💚',
  mandarin: '🍊',
  // Woods
  woods: '🌲',
  cedar: '🌲',
  sandalwood: '🪵',
  vetiver: '🌾',
  patchouli: '🍂',
  oud: '🪵',
  agarwood: '🪵',
  guaiac: '🌿',
  // Musks & Resins
  musk: '🌙',
  ambergris: '🪸',
  civet: '🌙',
  // Sweet & Gourmand
  vanilla: '🍦',
  caramel: '🍮',
  tonka: '🫘',
  praline: '🍰',
  chocolate: '🍫',
  honey: '🍯',
  // Resins & Balsams
  amber: '🟠',
  benzoin: '🟠',
  labdanum: '🟤',
  frankincense: '💨',
  myrrh: '💧',
  incense: '🕯️',
  // Spices
  spice: '🌶️',
  pepper: '🌶️',
  cardamom: '🌱',
  cinnamon: '🫙',
  clove: '🌰',
  saffron: '🌼',
  nutmeg: '🌰',
  // Fresh & Aquatic
  aquatic: '🌊',
  marine: '🌊',
  ozonic: '💨',
  fresh: '🍃',
  // Green & Herbal
  green: '🌿',
  grass: '🌱',
  mint: '🌿',
  basil: '🌿',
  lavender: '💜',
  rosemary: '🌿',
  sage: '🌿',
  thyme: '🌿',
  // Fruity
  fruity: '🍑',
  peach: '🍑',
  apple: '🍎',
  pear: '🍐',
  plum: '🟣',
  berry: '🫐',
  blackcurrant: '🫐',
  raspberry: '🫐',
  fig: '🫐',
  // Earthy
  earthy: '🌍',
  moss: '🌿',
  leather: '🟤',
  tobacco: '🍂',
  smoke: '💨',
  tar: '⚫',
  // Powdery
  powdery: '🤍',
  orris: '🤍',
  talc: '🤍',
  // Misc
  woody: '🪵',
  balsamic: '🟤',
  watery: '💧',
  metallic: '⚙️',
  aldehydic: '✨',
}

export function getNoteIcon(note) {
  if (!note) return '✦'
  const lower = note.toLowerCase().trim()
  // direct match
  if (NOTE_ICONS[lower]) return NOTE_ICONS[lower]
  // partial match
  for (const [key, icon] of Object.entries(NOTE_ICONS)) {
    if (lower.includes(key) || key.includes(lower)) return icon
  }
  return '✦'
}

export const NOTE_CATEGORIES = [
  'vanilla', 'rose', 'jasmine', 'oud', 'amber', 'musk', 'woods', 'cedar',
  'sandalwood', 'vetiver', 'patchouli', 'bergamot', 'citrus', 'lemon', 'orange',
  'lavender', 'iris', 'violet', 'peony', 'tuberose', 'ylang', 'neroli',
  'frankincense', 'myrrh', 'incense', 'leather', 'tobacco', 'smoke',
  'aquatic', 'marine', 'ozonic', 'fresh', 'green', 'grass', 'mint',
  'spice', 'pepper', 'cardamom', 'cinnamon', 'saffron', 'tonka', 'honey',
  'caramel', 'praline', 'chocolate', 'peach', 'apple', 'plum', 'berry',
  'powdery', 'orris', 'moss', 'earthy', 'aldehydic', 'fruity', 'woody'
]
