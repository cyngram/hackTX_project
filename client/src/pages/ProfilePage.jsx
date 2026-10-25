import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BADGES, BADGE_THRESHOLD, countGenre } from '../utils/badges'
import { useCollection } from '../Context/CollectionsContext'
import MovieDetail from '../components/MovieDetail/MovieDetail'
import './ProfilePage.css'
 
const FAVORITE_SLOTS = 4 // Letterboxd-style: 4 favorite posters up top
 
function formatShortDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
 
function ProfilePage() {
  const { username, setUsername, collection, favorites, watchlist, badges, resetProfile } =
    useCollection()
  const [selected, setSelected] = useState(null) // movie open in the popup
 
  const unlockedCount = BADGES.filter((b) => badges[b.genre]).length
 
  // newest first
  const recent = [...collection].sort(
    (a, b) => new Date(b.watchedAt || 0) - new Date(a.watchedAt || 0)
  )
 
  // fill empty favorite slots with placeholders
  const favSlots = [...favorites.slice(0, FAVORITE_SLOTS)]
  while (favSlots.length < FAVORITE_SLOTS) favSlots.push(null)
 
  function handleReset() {
    if (window.confirm('Clear your watched films, favorites and badges?')) resetProfile()
  }
 
  return (
    <main className="profile-page">
      {/* ---------- header ---------- */}
      <section className="profile-header">
        <div className="profile-identity">
          <span className="profile-avatar">🎬</span>
          <input
            aria-label="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={32}
          />
        </div>
 
        <div className="profile-stats">
          <div>
            <strong>{collection.length}</strong>
            <span>Watched</span>
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>Favorites</span>
          </div>
          <div>
            <strong>{watchlist.length}</strong>
            <span>Watchlist</span>
          </div>
          <div>
            <strong>
              {unlockedCount}/{BADGES.length}
            </strong>
            <span>Badges</span>
          </div>
        </div>
      </section>
 
      {/* ---------- 1. favorites ---------- */}
      <section className="profile-section">
        <h2 className="profile-label">Favorite Films</h2>
        <div className="profile-favorites">
          {favSlots.map((movie, i) =>
            movie ? (
              <button
                key={movie.id}
                className="profile-poster"
                onClick={() => setSelected(movie)}
                title={movie.title}
              >
                <img src={movie.poster} alt={movie.title} />
              </button>
            ) : (
              <Link key={`empty-${i}`} to="/browse" className="profile-poster is-empty">
                <span>☆</span>
              </Link>
            )
          )}
        </div>
        {favorites.length === 0 && (
          <p className="profile-hint">Open any movie and tap ☆ Favorite to pin it here.</p>
        )}
        {favorites.length > FAVORITE_SLOTS && (
          <p className="profile-hint">+{favorites.length - FAVORITE_SLOTS} more favorites</p>
        )}
      </section>
 
      {/* ---------- 2. badges ---------- */}
      <section className="profile-section">
        <h2 className="profile-label">Badges</h2>
        <div className="profile-badges">
          {BADGES.map((badge) => {
            const count = Math.min(countGenre(collection, badge.genre), BADGE_THRESHOLD)
            const earned = badges[badge.genre]
            return (
              <div
                key={badge.genre}
                className={`profile-badge ${earned ? 'is-earned' : ''}`}
                title={earned ? earned.message : `Watch ${BADGE_THRESHOLD - count} more ${badge.genre} movies`}
              >
                <span className="profile-badge-emoji">{badge.emoji}</span>
                <strong>{badge.name}</strong>
                <span className="profile-badge-genre">{badge.genre}</span>
                <div className="profile-progress">
                  <div style={{ width: `${(count / BADGE_THRESHOLD) * 100}%` }} />
                </div>
                <span className="profile-badge-count">
                  {earned ? '🏆 Earned' : `${count} / ${BADGE_THRESHOLD}`}
                </span>
              </div>
            )
          })}
        </div>
      </section>
 
      {/* ---------- 3. recently watched ---------- */}
      <section className="profile-section">
        <div className="profile-row-heading">
          <h2 className="profile-label">Recently Watched</h2>
          <Link to="/browse">+ Find more</Link>
        </div>
 
        {recent.length === 0 ? (
          <div className="profile-empty">
            <span>🍿</span>
            <p>Nothing here yet. Mark a movie as watched to start your diary.</p>
            <Link to="/browse">Browse movies</Link>
          </div>
        ) : (
          <div className="profile-recent">
            {recent.map((movie) => (
              <button
                key={movie.id}
                className="profile-recent-item"
                onClick={() => setSelected(movie)}
              >
                <div className="profile-poster">
                  {movie.poster ? <img src={movie.poster} alt={movie.title} /> : <span>🎞️</span>}
                </div>
                <span className="profile-recent-title">{movie.title}</span>
                <span className="profile-recent-date">{formatShortDate(movie.watchedAt)}</span>
              </button>
            ))}
          </div>
        )}
      </section>
 
      <button type="button" className="profile-reset" onClick={handleReset}>
        Reset profile
      </button>
 
      {selected && <MovieDetail movie={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
 
export default ProfilePage
