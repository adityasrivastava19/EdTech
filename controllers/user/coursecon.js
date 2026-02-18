const course = require('../../database/course');
const order = require('../../database/order');
const cloudinary = require('../../config/couldinary');

// get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await course.find().select("-videourl");
        res.status(200).json(courses);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// get single course
exports.getcourse = async (req, res) => {
    try {
        const foundCourse = await course.findById(req.params.id);
        if (!foundCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ course: foundCourse });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// watch after purchase
exports.watch = async (req, res) => {
    try {
        const Order = await order.findOne({
            user: req.user.id,
            course: req.params.id
        }).populate("course");

        if (!Order) {
            return res.status(403).json({ message: "buy the course first" });
        }

        const signedurl = cloudinary.url(Order.course.public_id, {
            resource_type: "video",
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 60 * 60
        });

        res.json({ videourl: signedurl });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
