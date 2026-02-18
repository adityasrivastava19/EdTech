const course = require('../../database/course');
const order = require('../../database/order');
const cloudinary = require('../../config/couldinary');

// get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await course.find().select("-videourl");
        res.status(200).json(courses);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};