import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import fakeMovies from "../data/fakeMovies";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./MovieCarousel.css";

function MovieCarousel() {
  const [movies, setMovies] = useState(fakeMovies);
  const [selected, setSelected] = useState(null); // fix 1

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMovies(data);
      })
      .catch(() => {});
  }, []);

  return (
    <> {/* fix 2 */}
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
              <div className="poster-card" onClick={() => setSelected(movie)}> {/* fix 3 */}
                <img src={movie.poster} alt={movie.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-box" onClick={(e) => e.stopPropagation()}>
            <img src={selected.poster} alt={selected.title} />
            <div className="detail-info">
              <button className="detail-close" onClick={() => setSelected(null)}>
                ✕
              </button>
              <h2>{selected.title}</h2>
              {(selected.year || selected.genre) && (
                <p className="detail-meta">
                  {[selected.year, selected.genre].filter(Boolean).join(" · ")}
                </p>
              )}
              {selected.description && <p>{selected.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieCarousel;