import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import PosterCard from '../PosterCard/PosterCard'
import MovieDetail from '../MovieDetail/MovieDetail'
import './MovieCarousel.css'
import { useCollection } from '../../Context/CollectionsContext'

const COVERFLOW = {
  rotate: 20,
  stretch: 0,
  modifier: 1,
  slideShadows: false,
}

function MovieCarousel({ movies = [] }) {
  const [selected, setSelected] = useState(null)
  const { hasMovie, toggleMovie } = useCollection()

  function openMovie(movie) {
    setSelected(movie)
  }

  function closeMovie() {
    setSelected(null)
  }

  return (
    <>
      <div className="movie-carousel">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={COVERFLOW}
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          loopAdditionalSlides={2}
          speed={1000}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} onClick={() => openMovie(movie)}>
              <PosterCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selected && <MovieDetail movie={selected} onClose={closeMovie} />}
    </>
  )
}

export default MovieCarousel