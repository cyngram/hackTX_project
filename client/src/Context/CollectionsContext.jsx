import { createContext, useContext, useEffect, useState } from 'react'
import {
  BADGES,
  BADGE_THRESHOLD,
  countGenre,
  getBadgeMessage,
  getGenres,
} from '../utils/badges'

// one shared context object, even if Vite loads this file twice
const CollectionContext = (globalThis.__collectionContext ??= createContext(null))
const STORAGE_KEY = 'cinematch-profile'
const EMPTY = { username: 'Movie Fan', collection: [], badges: {}, favorites: [], watchlist: [] }

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      username: saved?.username || EMPTY.username,
      collection: saved?.collection || [],
      badges: saved?.badges || {},
      favorites: saved?.favorites || [],
      watchlist: saved?.watchlist || [],
    }
  } catch {
    return EMPTY
  }
}

export function CollectionProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile)
  const [newBadge, setNewBadge] = useState(null)

  // save to the browser whenever the profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // storage unavailable, ignore
    }
  }, [profile])

  // award badges when a genre reaches the threshold
  useEffect(() => {
    const unlocked = BADGES.filter(
      (b) =>
        !profile.badges[b.genre] &&
        countGenre(profile.collection, b.genre) >= BADGE_THRESHOLD
    )
    if (unlocked.length === 0) return

    const earnedAt = new Date().toISOString()
    const awarded = unlocked.map((b) => ({
      ...b,
      message: getBadgeMessage(b.genre),
      earnedAt,
    }))

    setProfile((p) => {
      const badges = { ...p.badges }
      awarded.forEach((b) => {
        badges[b.genre] = { message: b.message, earnedAt: b.earnedAt }
      })
      return { ...p, badges }
    })
    setNewBadge(awarded[0])
  }, [profile.collection, profile.badges])

  const hasMovie = (id) => profile.collection.some((m) => String(m.id) === String(id))

  function toggleMovie(movie) {
    setProfile((p) => {
      const exists = p.collection.some((m) => String(m.id) === String(movie.id))
      const collection = exists
        ? p.collection.filter((m) => String(m.id) !== String(movie.id))
        : [
            ...p.collection,
            { ...movie, genres: getGenres(movie), watchedAt: new Date().toISOString() },
          ]
      return { ...p, collection }
    })
  }

  // favorites ("star") and watchlist ("save for later") are simple on/off lists
  const isFavorite = (id) => profile.favorites.some((m) => String(m.id) === String(id))
  const isSaved = (id) => profile.watchlist.some((m) => String(m.id) === String(id))

  function toggleList(listName, movie) {
    setProfile((p) => {
      const list = p[listName]
      const exists = list.some((m) => String(m.id) === String(movie.id))
      return {
        ...p,
        [listName]: exists
          ? list.filter((m) => String(m.id) !== String(movie.id))
          : [...list, movie],
      }
    })
  }

  function setUsername(username) {
    setProfile((p) => ({ ...p, username }))
  }

  function resetProfile() {
    setNewBadge(null)
    setProfile(EMPTY)
  }

  const value = {
    ...profile,
    newBadge,
    dismissNewBadge: () => setNewBadge(null),
    hasMovie,
    toggleMovie,
    isFavorite,
    isSaved,
    toggleFavorite: (movie) => toggleList('favorites', movie),
    toggleSaved: (movie) => toggleList('watchlist', movie),
    setUsername,
    resetProfile,
  }

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  return useContext(CollectionContext)
}