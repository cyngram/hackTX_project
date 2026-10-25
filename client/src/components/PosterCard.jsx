import './PosterCard.css'

function formatDate(dateString) {
  if (!dateString) return 'TBA'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function PosterCard({ movie }) {
  return (
    <div className="poster-card">
      <div className="poster-card-inner">
        <div className="poster-face poster-front">
          <img src={movie.poster} alt={movie.title} />
        </div>

        <div className="poster-face poster-back">
          <h3>{movie.title}</h3>
          <p className="poster-meta">Released {formatDate(movie.releaseDate)}</p>
          <p className="poster-label">Starring</p>
          <ul>
            {movie.stars?.slice(0, 3).map((star) => (
              <li key={star}>{star}</li>
            ))}
          </ul>
          {movie.platform && <span className="poster-platform">{movie.platform}</span>}
          <p className="poster-description">{movie.description}</p>
        </div>
      </div>
    </div>
  )
}

export default PosterCard 