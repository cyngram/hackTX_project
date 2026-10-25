import { Link } from 'react-router-dom'
import { useCollection } from '../Context/CollectionsContext'
import './BadgeUnlockModal.css'

function BadgeUnlockModal() {
  const { newBadge, dismissNewBadge } = useCollection()
  if (!newBadge) return null

  return (
    <div className="badge-modal-overlay" onClick={dismissNewBadge}>
      <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
        <p className="badge-modal-kicker">New badge unlocked!</p>
        <div className="badge-modal-emoji">{newBadge.emoji}</div>
        <h2>{newBadge.name}</h2>
        <p className="badge-modal-message">{newBadge.message}</p>
        <div className="badge-modal-actions">
          <Link to="/profile" onClick={dismissNewBadge}>
            View profile
          </Link>
          <button type="button" onClick={dismissNewBadge}>
            Keep watching
          </button>
        </div>
      </div>
    </div>
  )
}

export default BadgeUnlockModal