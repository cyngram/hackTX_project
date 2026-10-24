import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import './MovieCarousel.css'

const movies = [
  { id: 1, title: 'Movie One', poster: 'https://picsum.photos/seed/cinematch1/300/450' },
  { id: 2, title: 'Movie Two', poster: 'https://picsum.photos/seed/cinematch2/300/450' },
  { id: 3, title: 'Movie Three', poster: 'https://picsum.photos/seed/cinematch3/300/450' },
  { id: 4, title: 'Movie Four', poster: 'https://picsum.photos/seed/cinematch4/300/450' },
  { id: 5, title: 'Movie Five', poster: 'https://picsum.photos/seed/cinematch5/300/450' },
  { id: 6, title: 'Movie Six', poster: 'https://picsum.photos/seed/cinematch6/300/450' },
]

function MovieCarousel() {
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
          rotate: 50,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
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