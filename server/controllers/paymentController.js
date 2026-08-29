import crypto from "crypto";
import razorpayInstance from "../configs/razorpay.js";
import Booking from "../models/Bookings.js";

// API to create a Razorpay order for an existing booking
// POST /api/payment/razorpay/create-order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Make sure this booking actually belongs to the logged-in user
        if (booking.user !== req.user._id) {
            return res.json({ success: false, message: "Not authorized" });
        }

        if (booking.isPaid) {
            return res.json({ success: false, message: "Booking is already paid" });
        }

        const options = {
            amount: booking.totalPrice * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${booking._id}`,
            // notes carry through to the payment.captured webhook event too,
            // so this is how the webhook maps a payment back to our booking
            notes: {
                bookingId: booking._id.toString(),
            },
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to verify payment signature after Razorpay checkout completes (client-side path)
// POST /api/payment/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            return res.json({ success: false, message: "Payment verification failed" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        booking.isPaid = true;
        booking.paymentMethod = "Razorpay";
        await booking.save();

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Razorpay Webhook — Razorpay's server calls this directly (independent of frontend)
// POST /api/payment/razorpay/webhook
// IMPORTANT: this route needs the RAW request body (set up in server.js), not JSON-parsed
export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // req.body is a raw Buffer here — required for signature verification
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(req.body)
            .digest("hex");

        const receivedSignature = req.headers["x-razorpay-signature"];

        if (expectedSignature !== receivedSignature) {
            console.log("RAZORPAY WEBHOOK: signature mismatch");
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Signature verified — now parse the raw body into JSON to use the data
        const payload = JSON.parse(req.body);

        if (payload.event === "payment.captured") {
            const payment = payload.payload.payment.entity;
            const bookingId = payment.notes?.bookingId;

            if (bookingId) {
                const booking = await Booking.findById(bookingId);
                if (booking && !booking.isPaid) {
                    booking.isPaid = true;
                    booking.paymentMethod = "Razorpay";
                    await booking.save();
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.log("RAZORPAY WEBHOOK ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};