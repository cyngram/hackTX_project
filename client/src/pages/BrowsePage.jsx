import { Link } from 'react-router-dom'
import MovieCarousel from '../components/MovieCarousel'
import { genreRows } from '../data/sampleData'
import './BrowsePage.css'

function BrowsePage() {
  // backend teammate: replace genreRows with fetched data in the same shape
  return (
    <main className="browse-page">
      <Link to="/" className="browse-back">
        ← Home
      </Link>
      <h1>Browse All</h1>

      {genreRows.map((row) => (
        <section key={row.genre} className="genre-row">
          <h2>{row.genre}</h2>
          <MovieCarousel movies={row.movies} autoplay={false} />
        </section>
      ))}
    </main>
  )
}

export default BrowsePage