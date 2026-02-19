const crypto = require('crypto');
const instance = require('../../config/rozarpay');
const order = require('../../database/order');
const course = require('../../database/course');

// creating order
exports.createorder = async (req, res) => {
    try {
        const foundcourse = await course.findById(req.body.courseid);
        if (!foundcourse) {
            return res.status(404).json({ message: "course not found" });
        }

        // FREE course — enroll directly without Razorpay
        if (Number(foundcourse.price) === 0) {
            const existing = await order.findOne({ user: req.user.id, course: foundcourse._id });
            if (existing) {
                return res.status(200).json({ free: true, message: "already enrolled" });
            }
            await order.create({
                user: req.user.id,
                course: foundcourse._id,
                payment: "free"
            });
            return res.status(200).json({ free: true, message: "enrolled for free" });
        }

        // PAID course — create Razorpay order
        const orders = await instance.orders.create({
            amount: foundcourse.price * 100,
            currency: "INR",
        });
        return res.status(200).json({ orderId: orders.id });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// verifying the order (paid courses)
exports.verifyorder = async (req, res) => {
    try {
        const { rozarpay_order_id, rozarpay_payment_id, rozarpay_signature, courseid } = req.body;
        const body = rozarpay_order_id + "|" + rozarpay_payment_id;
        const ex = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
        if (ex !== rozarpay_signature) {
            return res.status(400).json({ message: "payment failed" });
        }
        await order.create({
            user: req.user.id,
            course: courseid,
            payment: rozarpay_payment_id
        });
        return res.status(200).json({ message: "payment successful" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}