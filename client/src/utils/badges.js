export const BADGE_THRESHOLD = 5

export const BADGES = [
  { genre: 'Romance', emoji: '💘', name: 'Hopeless Romantic' },
  { genre: 'Action', emoji: '💥', name: 'Adrenaline Junkie' },
  { genre: 'Thriller', emoji: '🔪', name: 'Edge-of-Seat Expert' },
  { genre: 'Horror', emoji: '👻', name: 'Scream Scholar' },
  { genre: 'Comedy', emoji: '😂', name: 'Professional Giggler' },
]

// If your API names genres differently, fix it here (only place)
export function getGenres(movie) {
  const raw = movie.genres ?? movie.genre ?? []
  const list = Array.isArray(raw) ? raw : [raw]
  return list.map((g) => (typeof g === 'string' ? g : g?.name)).filter(Boolean)
}

export function countGenre(collection, genre) {
  return collection.filter((m) =>
    getGenres(m).some((g) => g.toLowerCase() === genre.toLowerCase())
  ).length
}

// Add more lines to any list for more variety
const MESSAGES = {
  Romance: [
    "Ooh la la! You're a certified lover of love.",
    'Five love stories deep. Your heart called, it wants a vacation.',
    "You've cried at five weddings that weren't yours. Welcome to the club.",
    "Grand romantic gestures? You've studied them all. Boombox optional.",
    "Plot twist: you're the main character in a rom-com now.",
    'Five swoon-worthy movies in. Your heart is a puddle, and we respect it.',
  ],
  Action: [
    "Five explosions later, you're legally an action hero.",
    'Slow-motion walking away from an explosion? Earned it.',
    'Your couch has survived five car chases. Respect.',
    "Congrats! You can now yell 'Get down!' with total authority.",
    'Five action flicks watched, zero stunts attempted. The smartest hero of all.',
    'You never once blinked at an explosion. Suspicious, honestly.',
  ],
  Thriller: [
    'You trust no one now. Congratulations, detective.',
    'Five twists survived. Your heart rate would like a word.',
    'You saw the twist coming in all five. Or did you?',
    'Edge of your seat, five times over. The cushions are exhausted.',
    'You now suspect the butler in every situation. It is a gift.',
    'Five mysteries cracked. Please stop looking at your neighbors suspiciously.',
  ],
  Horror: [
    "Five scares down. You're officially too brave to check the basement. Don't.",
    'Five horror films watched and you still sleep with the closet door shut. Smart.',
    'Congrats! You now know exactly which character dies first.',
    'Five screams survived. Your neighbors have questions.',
    "Never splitting up, never whispering 'hello?' into the dark. You've learned.",
    'Scream Scholar status unlocked. Please keep the lights on.',
  ],
  Comedy: [
    'Five comedies in: your laugh is now a registered instrument.',
    'Certified giggle machine. Side effects include quoting movies nonstop.',
    'Five laugh-fests down, and your abs have done a full workout.',
    'You can now quote five movies at parties and ruin every joke. Congrats.',
    'Professional Giggler: five movies, zero straight faces.',
    'Your sense of humor has been officially certified. Results may vary.',
  ],
}

export function getBadgeMessage(genre) {
  const options = MESSAGES[genre] || ['You earned a badge!']
  return options[Math.floor(Math.random() * options.length)]
}