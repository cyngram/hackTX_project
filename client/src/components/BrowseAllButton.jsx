import { Link } from 'react-router-dom'
import './BrowseAllButton.css'

function BrowseAllButton() {
  return (
    <Link to="/browse" className="browse-all-btn">
      Browse all
    </Link>
  )
}

export default BrowseAllButton