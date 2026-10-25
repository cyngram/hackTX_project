import MovieCarousel from '../components/MovieCarousel'
import BrowseAllButton from '../components/BrowseAllButton'
import { trendingMovies } from '../data/sampleData'
import './HomePage.css'

function HomePage() {
  return (
    <main className="home-page">
      <BrowseAllButton />
      {/* teammates: hero heading, description and buttons go here */}
      <MovieCarousel movies={trendingMovies} />
    </main>
  )
}

export default HomePage