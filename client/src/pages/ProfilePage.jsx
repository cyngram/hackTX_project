import { Link } from 'react-router-dom'
import { BADGES, BADGE_THRESHOLD, countGenre, getGenres } from '../utils/badges'
import './ProfilePage.css'
import { useCollection } from '../Context/CollectionsContext'

function ProfilePage() {
  const {
    username,
    setUsername,
    collection,
    badges,
    toggleMovie,
    resetProfile
  } = useCollection()

  const unlockedCount = BADGES.filter(
    (badge) => badges[badge.genre]
  ).length

  function handleReset() {
    if (window.confirm('Clear your watched films and badges?')) {
      resetProfile()
    }
  }

  return (
    <main className="profile-page">

      <div className="profile-intro">
        <p className="profile-eyebrow">YOUR CINEMATIC JOURNEY</p>
        <h1>Movie Card Collection</h1>
        <p>Collect movies, complete genre challenges, and unlock badges!</p>
      </div>

      <section className="profile-summary">
        <div className="profile-identity">
          <span className="profile-avatar">🎬</span>
          <div>
            <label htmlFor="profile-username">Collector name</label>
            <input
              id="profile-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={32}
            />
          </div>
        </div>

        <div className="profile-numbers">
          <div>
            <strong>{collection.length}</strong>
            <span>Movies collected</span>
          </div>
          <div>
            <strong>{unlockedCount}/{BADGES.length}</strong>
            <span>Badges unlocked</span>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <h2>Your Genre Badges</h2>
        <p>Collect {BADGE_THRESHOLD} movies in a genre to unlock its badge!</p>

        <div className="profile-badge-grid">
          {BADGES.map((badge) => {
            const count = countGenre(collection, badge.genre)
            const unlocked = Boolean(badges[badge.genre])
            const progress = Math.min(count, BADGE_THRESHOLD)

            return (
              <div
                key={badge.genre}
                className={`profile-badge ${unlocked ? 'is-unlocked' : 'is-locked'}`}
              >
                <div className="profile-badge-emoji">
                  {badge.emoji}
                </div>

                <span className="profile-badge-genre">
                  {badge.genre}
                </span>

                <h3>{badge.name}</h3>

                {unlocked ? (
                  <p className="profile-badge-message">
                    {badges[badge.genre].message}
                  </p>
                ) : (
                  <p className="profile-badge-message">
                    {BADGE_THRESHOLD - progress} more movies to unlock!
                  </p>
                )}

                <div className="profile-progress">
                  <div
                    style={{
                      width: `${(progress / BADGE_THRESHOLD) * 100}%`
                    }}
                  />
                </div>

                <span className="profile-badge-count">
                  {unlocked
                    ? '🏆 BADGE EARNED'
                    : `${progress} / ${BADGE_THRESHOLD} movies`}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-heading">
          <div>
            <h2>Your Film Cards</h2>
            <p>Your collection of watched movies.</p>
          </div>

          <Link className="profile-browse-link" to="/browse">
            + Collect More
          </Link>
        </div>

        {collection.length === 0 ? (
          <div className="profile-empty">
            <span>🍿</span>
            <h3>Your collection is empty!</h3>
            <p>Start watching and collecting movies to fill your shelf.</p>
            <Link to="/browse">Browse movies</Link>
          </div>
        ) : (
          <div className="profile-movie-grid">
            {collection.map((movie, index) => (
              <div className="profile-movie-card" key={movie.id}>
                <div className="profile-movie-art">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} />
                  ) : (
                    <span>🎞️</span>
                  )}

                  <span className="profile-movie-number">
                    #{String(index + 1).padStart(3, '0')}
                  </span>
                </div>

                <div className="profile-movie-details">
                  <h3>{movie.title}</h3>

                  <p>
                    {getGenres(movie).slice(0, 2).join(' · ') || 'Movie'}
                    {movie.year ? ` · ${movie.year}` : ''}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleMovie(movie)}
                  >
                    Remove Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        className="profile-reset"
        onClick={handleReset}
      >
        Reset My Collection
      </button>
    </main>
  )
}

export default ProfilePage
