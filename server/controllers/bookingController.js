import resend from "../configs/resend.js";
import Booking from "../models/Bookings.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room}) => {
        try {
            const bookings = await Booking.find({
                room,
                checkInDate:{$lte:checkOutDate},
                checkOutDate:{$gte:checkInDate},
            })
            const isAvailable = bookings.length === 0;
            return isAvailable
        } catch (error) {
            console.log(error.message)
        }
}

// API to check availability of Room
// Post /api/bookings/check-availability

export const checkAvailabilityAPI = async (req,res) => {
    try {
        const {room,checkInDate,checkOutDate} = req.body
        const isAvailable = await checkAvailability({room,checkInDate,checkOutDate})
        res.json({success:true,isAvailable})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
} 

// API to create a new booking
// Post /api/bookings/book

export const createBooking = async (req,res) => {
    try {
        const {room,checkInDate,checkOutDate,guests} = req.body
        const user = req.user._id; 

        // Before booking check availability
        const isAvailable = await checkAvailability({room,checkInDate,checkOutDate})

        if(!isAvailable){
            return res.json({success:false , message:"Room is not availability"})
        }
        //  get Total price from room
            const roomData = await Room.findById(room).populate("hotel")
            let totalPrice = roomData.pricePerNight

        // calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff/(1000*3600*24))
        totalPrice *= nights

        const booking = await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        const mailOptions = {
             from: "Roomvexo <onboarding@resend.dev>",
             to: req.user.email,
             subject: "Roomvexo Booking Confirmation",
             html: `
                    <h2>Booking Confirmed 🎉</h2>

                    <p>Hello ${req.user.name || "Guest"},</p>

                    <p>Your hotel booking has been successfully confirmed.</p>

                    <h3>Booking Details</h3>

                    <p><strong>Booking ID:</strong> ${booking._id}</p>
                    <p><strong>Hotel:</strong> ${roomData.hotel.name}</p>
                    <p><strong>Room ID:</strong> ${booking.room}</p>
                    <p><strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</p>
                    <p><strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</p>
                    <p><strong>Guests:</strong> ${booking.guests}</p>
                    <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
                    <br />
                    <p>Thank you for booking with Roomvexo! </p>
                `
        }

        await resend.emails.send(mailOptions)
        res.json({success:true , message:"Booking created successfully"})
    } catch (error) {
        console.log(error)
        res.json({success:false , message:"Failed to create booking"})
    }
}

// API to get all bookings for a user 
// GET /api/bookings/user

export const getUserBookings = async (req,res) => {
    try {
        const user = req.user._id
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success:true , bookings})
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}

export const getHotelBooking = async (req,res) => {
    try {
        const hotel = await Hotel.findOne({owner:req.auth.userId})
    if(!hotel){
        return res.json({succes:false,message:"No hotel found"})
    }
    const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt:-1})
    // Total Bookings
    const totalBookings = bookings.length
    
    // Total Revenue
    const totalRevenue = bookings.reduce((acc,booking)=>acc+booking.totalPrice,0)

    res.json({succes:true , dashboardData:{totalBookings,totalRevenue,bookings}})
    } catch (error) {
        res.json({succes:false,message:"Failed to fetch bookings"})
    }
}