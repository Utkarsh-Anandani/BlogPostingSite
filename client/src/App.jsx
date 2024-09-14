import './App.css'
import './Responsive.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import WriteBlog from './pages/WriteBlog'
import RegisterationPage from './pages/RegisterationPage'
import { useState } from 'react'
import PostPage from './pages/PostPage'
import EditBlog from './pages/EditBlog'

function App() {
  const [userInfo, setuserInfo] = useState(null)
  return (
    <Routes>
      <Route path='/' element={<Layout userInfo={userInfo} setuserInfo={setuserInfo} />}>
        <Route index element={
          <HomePage />
        } />

        <Route path={'/register'} element={
          <RegisterationPage />
        } />

        <Route path={'/login'} element={
          <LoginPage userInfo={userInfo} setuserInfo={setuserInfo} />
        } />

        <Route path={'/create'} element={
          <WriteBlog />
        } />

        <Route path={'/post/:id'} element={
          <PostPage userInfo={userInfo} setuserInfo={setuserInfo} />
        } />

        <Route path={'/edit/:id'} element={
          <EditBlog userInfo={userInfo} setuserInfo={setuserInfo} />
        } />
      </Route>
    </Routes >
  )
}

export default App
