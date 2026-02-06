import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Singup from './pages/singup.jsx'
import Singin from './pages/singin.jsx' 
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/signin" element={<Singin />} />
      </Routes>
    </Router>
  )
}

export default App
