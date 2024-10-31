
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PostPage from './pages/PostPage/PostPage'

function App() {
  const auth = useSelector(state => state.auth);

  return (
    <div className = 'mx-w-10'>
      <Routes>
        <Route path="/" element={auth.currentUser ? <Home /> : <Navigate to="/login"/>} />
        <Route path="/login" element={auth.currentUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={auth.currentUser ? <Navigate to="/" /> : <Signup />} />
        <Route path="/post/:id" element={auth.currentUser ? <PostPage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
