import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import PosterCard from '../PosterCard/PosterCard'
import './MovieCarousel.css'

const COVERFLOW = {
  rotate: 20,
  stretch: 0,
  depth: 150,
  modifier: 1,
  slideShadows: false,
}

function formatDate(dateString) {
  if (!dateString) return 'TBA'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function MovieCarousel({ movies = [] }) {
  const [selected, setSelected] = useState(null)

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

      {selected && (
        <div className="detail-overlay" onClick={closeMovie}>
          <div className="detail-box" onClick={(e) => e.stopPropagation()}>
            <img src={selected.poster} alt={selected.title} />
            <div className="detail-info">
              <button className="detail-close" onClick={closeMovie}>✕</button>
              <h2>{selected.title}</h2>
              <p className="detail-meta">Released {formatDate(selected.releaseDate)}</p>
              {selected.platform && (
                <span className="detail-platform">{selected.platform}</span>
              )}
              {selected.stars?.length > 0 && (
                <p className="detail-stars">Starring {selected.stars.join(', ')}</p>
              )}
              {selected.description && <p>{selected.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MovieCarousel