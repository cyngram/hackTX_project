import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCollection } from '../../Context/CollectionsContext'
import { fetchProviders, fetchShowtimes, isInTheaters, isRealMovie } from '../../api/movies'
import './MovieDetail.css'

// Shared movie popup, used by MovieCarousel and RecBox.
// Every field is optional, so it works for TMDB movies, sample movies and Gemini picks.

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function MovieDetail({ movie, onClose }) {
  // close with the Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // ---------- streaming services (loads as soon as the popup opens) ----------
  const [providers, setProviders] = useState(null)
  useEffect(() => {
    if (!isRealMovie(movie)) return
    let cancelled = false
    fetchProviders(movie.id)
      .then((data) => !cancelled && setProviders(data))
      .catch((err) => console.warn('No providers:', err.message))
    return () => {
      cancelled = true
    }
  }, [movie])

  // ---------- showtimes (only on button click, to save SerpApi searches) ----------
  const [showtimes, setShowtimes] = useState(null) // null = not asked yet
  const [showtimeStatus, setShowtimeStatus] = useState('idle') // idle | loading | error
  const [dayIndex, setDayIndex] = useState(0)

  function loadShowtimes() {
    setShowtimeStatus('loading')
    fetchShowtimes(movie.title)
      .then((days) => {
        setShowtimes(days)
        setDayIndex(0)
        setShowtimeStatus('idle')
      })
      .catch(() => setShowtimeStatus('error'))
  }

  // show streaming first, then rent, then buy
  const [streamLabel, streamList] = providers?.stream?.length
    ? ['Stream on', providers.stream]
    : providers?.rent?.length
      ? ['Rent on', providers.rent]
      : providers?.buy?.length
        ? ['Buy on', providers.buy]
        : ['', []]
  const day = showtimes?.[dayIndex]

  const { hasMovie, toggleMovie, isFavorite, toggleFavorite, isSaved, toggleSaved } =
    useCollection()
  const watched = hasMovie(movie.id)
  const starred = isFavorite(movie.id)
  const saved = isSaved(movie.id)

  const date = movie.releaseDate ? `Released ${formatDate(movie.releaseDate)}` : movie.year

  const platform = movie.platform || movie.streaming?.[0]
  const summary = movie.overview || movie.description

  // createPortal puts the popup at the end of <body>, so styles from the
  // carousel or the chat box (and Swiper's 3D transforms) can't mess with it
  return createPortal(
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-box" onClick={(e) => e.stopPropagation()}>
        {movie.poster && <img src={movie.poster} alt={movie.title} />}

        <div className="detail-info">
          <button className="detail-close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <h2>{movie.title}</h2>
          {/* small pills: rating, year/date, genres */}
          <div className="detail-pills">
            {movie.rating > 0 && <span className="detail-pill is-rating">★ {movie.rating}</span>}
            {date && <span className="detail-pill">{date}</span>}
            {movie.genres?.map((g) => (
              <span key={g} className="detail-pill">{g}</span>
            ))}
          </div>

          <div className="detail-actions">
            <button
              className={watched ? 'is-on' : ''}
              onClick={() => toggleMovie(movie)}
              aria-pressed={watched}
            >
              {watched ? '✓ Watched' : '+ Watched'}
            </button>
            <button
              className={starred ? 'is-on' : ''}
              onClick={() => toggleFavorite(movie)}
              aria-pressed={starred}
            >
              {starred ? '★ Favorited' : '☆ Favorite'}
            </button>
            <button
              className={saved ? 'is-on' : ''}
              onClick={() => toggleSaved(movie)}
              aria-pressed={saved}
            >
              {saved ? '⛉ Saved' : '⛉ Save for later'}
            </button>
          </div>

          {platform && !streamList.length && <span className="detail-platform">{platform}</span>}

          {/* where to watch (TMDB, data from JustWatch) */}
          {streamList.length > 0 && (
            <div className="detail-providers">
              <span className="detail-subhead">{streamLabel}</span>
              <div className="detail-provider-list">
                {streamList.slice(0, 6).map((p) => (
                  <a
                    key={p.id}
                    href={providers.link}
                    target="_blank"
                    rel="noreferrer"
                    title={p.name}
                  >
                    <img src={p.logo} alt={p.name} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* loaded but no services → say so, so it doesn't look broken */}
          {providers && streamList.length === 0 && (
            <p className="detail-stars">
              {isInTheaters(movie) ? 'Not streaming yet. Catch it in theaters!' : 'Not streaming in the US right now.'}
            </p>
          )}

          {/* showtimes for newer movies */}
          {isInTheaters(movie) && (
            <div className="detail-showtimes">
              {showtimes === null ? (
                <button
                  className="detail-showtime-btn"
                  onClick={loadShowtimes}
                  disabled={showtimeStatus === 'loading'}
                >
                  {showtimeStatus === 'loading'
                    ? 'Finding showtimes…'
                    : showtimeStatus === 'error'
                      ? "Couldn't load showtimes. Try again?"
                      : ' ⤷ Showtimes near Austin'}
                </button>
              ) : showtimes.length === 0 ? (
                <p className="detail-stars">No showtimes found near Austin right now.</p>
              ) : (
                <>
                  <span className="detail-subhead">Showtimes near Austin</span>
                  <div className="detail-days">
                    {showtimes.slice(0, 4).map((d, i) => (
                      <button
                        key={d.day}
                        className={i === dayIndex ? 'is-on' : ''}
                        onClick={() => setDayIndex(i)}
                      >
                        {d.day}
                      </button>
                    ))}
                  </div>
                  {day?.theaters.slice(0, 5).map((t) => (
                    <div key={t.name} className="detail-theater">
                      <strong>{t.name}</strong>
                      {t.distance && <span className="detail-theater-meta">{t.distance}</span>}
                      <div className="detail-times">
                        {t.times.map((s, i) => (
                          <a
                            key={i}
                            href={t.link || undefined}
                            target="_blank"
                            rel="noreferrer"
                            title={s.type}
                          >
                            {s.time}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {movie.stars?.length > 0 && (
            <p className="detail-stars">Starring {movie.stars.join(', ')}</p>
          )}

          {/* only Gemini picks have a reason */}
          {movie.reason && (
            <p className="detail-why">
              <strong>Why Poppy picked this:</strong> {movie.reason}
            </p>
          )}

          {summary && <p className="detail-summary">{summary}</p>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MovieDetail