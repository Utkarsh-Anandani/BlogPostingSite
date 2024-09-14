import React from 'react'
import Navbar from './Navbar.jsx'
import { Outlet } from 'react-router-dom'

const Layout = ({userInfo, setuserInfo}) => {
  return (
    <main>
        <div className="navbar">
          <Navbar userInfo = {userInfo} setuserInfo = {setuserInfo} />
        </div>
        <Outlet/>
    </main>
  )
}

export default Layout
