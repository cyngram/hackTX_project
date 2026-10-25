// Fetches movies from our Express server (/api/movies) and reshapes them
// into the format PosterCard and the popup expect.

// TMDB data -> card data
export function toCardMovie(m) {
  return {
    ...m,
    releaseDate: m.releaseDate || (m.year ? `${m.year}-01-01` : null),
    description: m.description || m.overview || '',
    platform: m.platform || m.streaming?.[0] || null,
    stars: m.stars || [],
  }
}

// genre is optional: no genre = trending this week
export async function fetchMovies(genre) {
  const url = genre ? `/api/movies?genre=${encodeURIComponent(genre)}` : '/api/movies'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`/api/movies failed with ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('/api/movies did not return a list')
  return data.map(toCardMovie)
}


// TMDB ids are numbers; sample movies have ids like "trending-1"
export function isRealMovie(movie) {
  return /^\d+$/.test(String(movie?.id))
}

// where to stream / rent / buy in the US
export async function fetchProviders(id) {
  const res = await fetch(`/api/movies/${id}/providers`)
  if (!res.ok) throw new Error(`providers failed with ${res.status}`)
  return res.json()
}

// theater showtimes near Austin (SerpApi)
export async function fetchShowtimes(title) {
  const res = await fetch(`/api/showtimes?title=${encodeURIComponent(title)}`)
  if (!res.ok) throw new Error(`showtimes failed with ${res.status}`)
  return res.json()
}

// "newer" = came out in the last 60 days, so it might still be in theaters
export function isInTheaters(movie) {
  if (!movie?.releaseDate) return false
  const days = (Date.now() - new Date(movie.releaseDate)) / 86400000
  return days >= -1 && days <= 60
}