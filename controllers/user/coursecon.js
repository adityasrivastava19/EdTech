const course = require('../../database/course');
const order = require('../../database/order');
const lecture = require('../../database/lecture');
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

// watch after purchase — returns lecture list + signed URL for requested lecture
exports.watch = async (req, res) => {
    try {
        const courseId = req.params.id;
        const lectureId = req.query.lecture; // optional ?lecture=<id>

        // Fetch all lectures sorted by order
        const lectures = await lecture.find({ course: courseId }).sort({ order: 1 });
        if (!lectures.length) {
            return res.status(404).json({ message: "No lectures found for this course" });
        }

        // Check if user has purchased this course
        const hasPurchased = !!(await order.findOne({ user: req.user.id, course: courseId }));

        // Pick which lecture to play
        const target = lectureId
            ? lectures.find(l => l._id.toString() === lectureId)
            : lectures[0];

        if (!target) return res.status(404).json({ message: "Lecture not found" });

        // Access control: preview lectures are free; others need purchase
        if (!target.isPreview && !hasPurchased) {
            return res.status(403).json({ message: "buy the course first" });
        }

        // Generate signed Cloudinary URL (1 hour expiry)
        const signedurl = cloudinary.url(target.public_id, {
            resource_type: "video",
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 60 * 60
        });

        // Return lecture list (safe — no raw public_ids) + signed video URL
        const lectureList = lectures.map(l => ({
            _id: l._id,
            title: l.title,
            order: l.order,
            isPreview: l.isPreview,
            locked: !l.isPreview && !hasPurchased,
        }));

        res.json({ videourl: signedurl, lecture: target, lectures: lectureList, hasPurchased });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
