
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PostPage from './pages/PostPage/PostPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import NavBar from './components/NavBar'
import BlockedUsers from './pages/Settings/BlockedUsers'
import FollowRequests from './pages/Settings/FollowRequests'

function App() {
  const auth = useSelector(state => state.auth);

  return (
    <div>  
      {auth.currentUser && <NavBar />}
      <Routes>
        <Route path="/" element={auth.currentUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path="/login" element={auth.currentUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={auth.currentUser ? <Navigate to="/" /> : <Signup />} />
        <Route path="/post/:id" element={auth.currentUser ? <PostPage /> : <Navigate to="/login"/>} />
        <Route path="/profile/:username" element = {auth.currentUser ? <ProfilePage /> : <Navigate to="/login"/>} />
        <Route path="/blockedUsers" element = {auth.currentUser ? <BlockedUsers /> : <Navigate to="/login"/>} />
        <Route path="/followRequests" element = {auth.currentUser ? <FollowRequests /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
