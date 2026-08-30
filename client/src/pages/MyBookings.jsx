import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const {axios, getToken , user} = useAppContext()
    const [bookings, setBookings] = useState([])

    const fetchUserBookings = async () => {
        try {
            const {data} = await axios.get('/api/bookings/user',{ headers:{Authorization:`Bearer ${await getToken()}`}})
            if(data.success){
                setBookings(data.bookings)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

     const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

     const handlePayment = async (booking) => {
        try {
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway. Check your connection.')
                return
            }
 
            const { data } = await axios.post(
                '/api/payment/razorpay/create-order',
                { bookingId: booking._id },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )
 
            if (!data.success) {
                toast.error(data.message)
                return
            }
 
            const options = {
                key: data.keyId,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Roomvexo',
                description: `Booking payment for ${booking.hotel.name}`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await axios.post(
                            '/api/payment/razorpay/verify',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: booking._id,
                            },
                            { headers: { Authorization: `Bearer ${await getToken()}` } }
                        )
                        if (verifyRes.data.success) {
                            toast.success('Payment successful!')
                            fetchUserBookings()
                        } else {
                            toast.error(verifyRes.data.message)
                        }
                    } catch (error) {
                        toast.error(error.message)
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || '',
                },
                theme: {
                    color: '#2563EB',
                },
            }
 
            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(user){
            fetchUserBookings()
        }
    },[user])
    
  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title="My Bookings" subTitle="Easily manage your past, current , and upcoming hotel reservations in one place. Plan your trips seamlessly with just a new clicks" align="left"/>

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3 '>
            <div className='w-1/3'>Hotels</div>
            <div className='w-1/3'>Date & Timings</div>
            <div className='w-1/3'>Payment</div>
        </div>

        {bookings.map((booking)=>(
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-b-gray-300 py-6 first:border-t'>
                {/* Hotels Details */}
                <div className='flex flex-col md:flex-row'>
                    <img src={booking.room.images[0]} alt="Hotel-image" className='md:w-44 rounded shadow object-cover'/>
                        <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                            <p className='font-playfair text-2xl'>{booking.hotel.name}
                            <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                            </p>
                    
                            <div className='flex items-center gap-1 text-sm text-gray-500 '>
                                <img src={assets.locationIcon} alt="Loaction-Icon"/>
                                <span>{booking.hotel.address}</span>
                            </div>
                            <div className='flex items-center gap-1 text-sm text-gray-500 '>
                                <img src={assets.guestsIcon} alt="guest-Icon"/>
                                <span>Guests: {booking.guests}</span>
                            </div>
                            <p className='text-base'>Total: ₹{booking.totalPrice}</p>
                        </div>
                </div>
                {/* Date & Timings */}
                <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                    <div>
                        <p>Check-In:</p>
                        <p className='text-gary-500 text-sm'>
                            {new Date(booking.checkInDate).toDateString()}
                        </p>
                    </div>
                    <div>
                        <p>Check-Out:</p>
                        <p className='text-gary-500 text-sm'>
                            {new Date(booking.checkOutDate).toDateString()}
                        </p>
                    </div>
                </div>
                {/* payment Status */}
                <div className='flex flex-col items-start justify-center pt-3 '>
                    <div className='flex items-center gap-2'>
                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                            {booking.isPaid ? "Paid" : "Unpaid"}
                        </p>
                    </div>
                    {!booking.isPaid && (
                        <button  onClick={()=>handlePayment(booking)} className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                            Pay Now
                        </button>
                    )}
                </div>
            </div>
        ))}

      </div>

    </div>
  )
}

export default MyBookings
