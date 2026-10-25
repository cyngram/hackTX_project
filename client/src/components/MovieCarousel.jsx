import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import PosterCard from './PosterCard'
import './MovieCarousel.css'

// paste your tuned values here
const COVERFLOW = {
  rotate: 20,
  stretch: 0,
  depth: 150,
  modifier: 1,
  slideShadows: false,
}

function MovieCarousel({ movies = [], autoplay = true }) {
  function handleClick(event) {
    const card = event.target.closest('.poster-card')
    if (!card) return
    card.classList.toggle('is-flipped')

    if (!autoplay) return
    const container = event.currentTarget
    const swiper = container.querySelector('.swiper')?.swiper
    if (!swiper) return

    if (container.querySelector('.poster-card.is-flipped')) {
      swiper.autoplay.stop()
    } else {
      swiper.autoplay.start()
    }
  }

  return (
    <div className="movie-carousel" onClick={handleClick}>
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        coverflowEffect={COVERFLOW}
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        loopAdditionalSlides={2}
        speed={1000}
        autoplay={
          autoplay
            ? { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <PosterCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default MovieCarousel