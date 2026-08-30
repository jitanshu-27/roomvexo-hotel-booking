import React from 'react'
import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HotelReg from './components/HotelReg'
import Layout from './pages/hotelOwner/Layout'
import {Toaster} from "react-hot-toast"
import { useAppContext } from './context/AppContext'

const Home = lazy(() => import('./pages/Home'));
const Allrooms = lazy(() => import('./pages/Allrooms'));
const RoomDetails = lazy(() => import('./pages/RoomDetails'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Dashboard = lazy(() => import('./pages/hotelOwner/Dashboard'));
const AddRoom = lazy(() => import('./pages/hotelOwner/AddRoom'));
const ListRoom = lazy(() => import('./pages/hotelOwner/ListRoom'));


const App = () => {
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith("/owner")
  const {showHotelReg} = useAppContext()
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg/>}
      <div className='min-h-[70vh]'>
      <Suspense fallback={<div className="flex justify-center items-center h-[70vh] text-gray-500">Loading...</div>}>
       <Routes >
          <Route path='/'element={<Home/>}/>
          <Route path='/rooms'element={<Allrooms/>}/>
          <Route path='/rooms/:id'element={<RoomDetails/>}/>
          <Route path='/my-bookings'element={<MyBookings/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='add-room' element={<AddRoom/>}/>
            <Route path='list-room' element={<ListRoom/>}/>
          </Route>
       </Routes>
       </Suspense>
      </div>
      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App
