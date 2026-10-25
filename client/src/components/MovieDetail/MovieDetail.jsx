import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCollection } from '../../Context/CollectionsContext'
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
              {saved ? '🔖 Saved' : '🔖 Save for later'}
            </button>
          </div>

          {platform && <span className="detail-platform">{platform}</span>}

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