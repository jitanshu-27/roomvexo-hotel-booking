import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  const location = useLocation()
  const isOwnerPath = location.pathname.includes("owner")
  return (
    <div>
      {!isOwnerPath && <Navbar />}
    </div>
  )
}

export default App
