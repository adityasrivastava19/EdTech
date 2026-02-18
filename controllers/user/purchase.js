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

// verifying the order
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