import { useState, useEffect } from 'react'
import MovieCarousel from '../components/MovieCarousel/MovieCarousel'
import { trendingMovies } from '../data/sampleData'
import { fetchMovies } from '../api/movies'
import RecBox from '../components/RecBox/RecBox'
import './HomePage.css'

function HomePage() {
  // start with sample movies so the page never looks empty, then swap in real ones
  const [movies, setMovies] = useState(trendingMovies)
  const [source, setSource] = useState('sample')

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        if (data.length > 0) {
          setMovies(data)
          setSource('api')
        }
      })
      .catch((err) => console.warn('Using sample movies:', err.message))
  }, [])

  return (
    <main className="home-page">
      <RecBox />
      {/* teammates: hero heading, description and buttons go here */}
      {/* key makes Swiper rebuild cleanly when real movies arrive */}
      <MovieCarousel key={source} movies={movies} />
    </main>
  )
}

export default HomePage
