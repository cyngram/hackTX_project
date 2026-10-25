import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

// change this to your app's name (or swap in an <img> once you have a logo)
const APP_NAME = 'Find Your Film'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        {APP_NAME}
      </Link>

      <div className="navbar-links">
        {/* NavLink adds the "active" class to the page you're on */}
        <NavLink to="/" end className="navbar-link">
          Home
        </NavLink>
        <NavLink to="/browse" className="navbar-link">
          Browse
        </NavLink>
      </div>

      <NavLink to="/profile" className="navbar-profile" aria-label="Profile">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      </NavLink>
    </nav>
  )
}

export default Navbar
