import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MovieCarousel from '../components/MovieCarousel'
import { genreRows } from '../data/sampleData'
import { fetchMovies } from '../api/movies'
import './BrowsePage.css'

function BrowsePage() {
  // start with sample rows, then replace each genre with real movies
  const [rows, setRows] = useState(genreRows)
  const [source, setSource] = useState('sample')

  useEffect(() => {
    Promise.all(
      genreRows.map((row) =>
        fetchMovies(row.genre)
          .then((movies) => ({ genre: row.genre, movies: movies.length ? movies : row.movies }))
          .catch(() => row) // if one genre fails, keep its sample row
      )
    ).then((loaded) => {
      setRows(loaded)
      setSource('api')
    })
  }, [])

  return (
    <main className="browse-page">
      <Link to="/" className="browse-back">
        ← Home
      </Link>
      <h1>Browse All</h1>

      {rows.map((row) => (
        <section key={row.genre} className="genre-row">
          <h2>{row.genre}</h2>
          <MovieCarousel key={source} movies={row.movies} autoplay={false} />
        </section>
      ))}
    </main>
  )
}

export default BrowsePage
