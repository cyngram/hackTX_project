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
