import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room , index}) => {
  return (
    <Link to={'/rooms/' + room._id} onClick={()=>scrollTo(0,0)} key={room._id}>
        <div className='relative'>
            <img src={room.images[0]} alt="" className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.5)]'/>
            {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}
        </div>
        <div className="p-4">

    {/* Row 1 */}
    <div className="flex items-center justify-between">
        <p className="font-playfair text-xl font-medium text-gray-800">
            {room.hotel.name}
        </p>

        <div className="flex items-center gap-1">
            <img src={assets.starIconFilled} alt="" className="w-4 h-4" />
            <span>4.5</span>
        </div>
    </div>

    {/* Row 2 */}
    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
        <img src={assets.locationIcon} alt="" className="w-4 h-4" />
        <span>{room.hotel.address}</span>
    </div>

    {/* Row 3 */}
    <div className="flex items-center justify-between mt-4">

        <p>
            <span className="text-2xl font-semibold text-gray-800">
                ₹{room.pricePerNight}
            </span>
            <span className="text-gray-500"> /night</span>
        </p>

        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Book Now
        </button>

    </div>

</div>
    </Link>
  )
}

export default HotelCard