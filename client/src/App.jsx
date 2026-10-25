import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import ProfilePage from './pages/ProfilePage'
import { CollectionProvider } from './Context/CollectionsContext'
import BadgeUnlockModal from './components/BadgeUnlockModal'

function App() {
  return (
    <CollectionProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BadgeUnlockModal />
      </BrowserRouter>
    </CollectionProvider>
  )
}

export default App