import { Swiper, SwiperSlide } from 'swiper/react'
import { useState, useEffect } from 'react'
import fakeMovies from '../data/fakeMovies'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import './MovieCarousel.css'

function MovieCarousel() {
  const [movies, setMovies] = useState(fakeMovies)
  useEffect(() => {
    fetch('/api/movies')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMovies(data)
      })
      .catch(() => {})
  }, [])
  return (
    <div className="movie-carousel">
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        initialSlide={2}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <img src={movie.poster} alt={movie.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default MovieCarousel