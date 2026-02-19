const course = require('../../database/course');
const lecture = require('../../database/lecture');
const user = require('../../database/user');
const cloudinary = require('../../config/couldinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Disk storage — saves temp file, avoids loading large videos into RAM
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, os.tmpdir()),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500 MB max
});

// Helper: upload a file on disk to Cloudinary, then delete temp file
const uploadToCloudinary = (filePath, folder, resource_type = 'image') => {
    return cloudinary.uploader.upload(filePath, {
        folder,
        resource_type,
        timeout: 120000, // 2 min
    }).then(result => {
        // clean up temp file
        try { fs.unlinkSync(filePath); } catch (_) { }
        return result;
    });
};

// GET all courses by this instructor
exports.getMyCourses = async (req, res) => {
    try {
        const courses = await course.find({ instructor: req.user.id });
        res.json(courses);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET lectures for a course
exports.getLectures = async (req, res) => {
    try {
        const found = await course.findOne({ _id: req.params.id, instructor: req.user.id });
        if (!found) return res.status(404).json({ message: 'Course not found or not yours' });
        const lectures = await lecture.find({ course: req.params.id }).sort({ order: 1 });
        res.json(lectures);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST create a new course
exports.createCourse = [
    upload.single('thumbnail'),
    async (req, res) => {
        try {
            const { title, description, price } = req.body;
            if (!title || !description || !price) {
                return res.status(400).json({ message: "title, description, and price are required" });
            }
            let thumbnail = "";
            let thumbnail_public_id = "";
            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer, 'course_thumbnails', 'image');
                thumbnail = result.secure_url;
                thumbnail_public_id = result.public_id;
            }
            const newCourse = await course.create({
                title,
                description,
                price: Number(price),
                thumbnail,
                thumbnail_public_id,
                instructor: req.user.id
            });
            res.status(201).json({ message: "Course created", course: newCourse });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

// PUT update course details
exports.updateCourse = async (req, res) => {
    try {
        const found = await course.findOne({ _id: req.params.id, instructor: req.user.id });
        if (!found) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }
        const updated = await course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Course updated", course: updated });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE a course
exports.deleteCourse = async (req, res) => {
    try {
        const found = await course.findOne({ _id: req.params.id, instructor: req.user.id });
        if (!found) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }
        // Delete thumbnail from cloudinary if it exists
        if (found.thumbnail_public_id) {
            await cloudinary.uploader.destroy(found.thumbnail_public_id);
        }
        await course.findByIdAndDelete(req.params.id);
        await lecture.deleteMany({ course: req.params.id });
        res.json({ message: "Course and its lectures deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST add a lecture to a course
exports.addLecture = [
    upload.single('video'),
    async (req, res) => {
        try {
            const found = await course.findOne({ _id: req.params.id, instructor: req.user.id });
            if (!found) {
                return res.status(404).json({ message: "Course not found or not yours" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "Video file is required" });
            }
            const { title, description, order: lectureOrder, isPreview, duration } = req.body;
            if (!title || lectureOrder === undefined) {
                return res.status(400).json({ message: "title and order are required" });
            }
            const result = await uploadToCloudinary(req.file.path, 'course_videos', 'video');
            const newLecture = await lecture.create({
                title,
                description: description || "",
                videourl: result.secure_url,
                public_id: result.public_id,
                order: Number(lectureOrder),
                isPreview: isPreview === 'true',
                duration: Number(duration) || 0,
                course: req.params.id
            });
            // Increment totalLectures
            await course.findByIdAndUpdate(req.params.id, { $inc: { totalLectures: 1 } });
            res.status(201).json({ message: "Lecture added", lecture: newLecture });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
];

// DELETE a lecture
exports.deleteLecture = async (req, res) => {
    try {
        const foundLecture = await lecture.findById(req.params.lectureId);
        if (!foundLecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }
        // Verify instructor owns the parent course
        const foundCourse = await course.findOne({ _id: foundLecture.course, instructor: req.user.id });
        if (!foundCourse) {
            return res.status(403).json({ message: "Not authorized" });
        }
        // Delete video from cloudinary
        await cloudinary.uploader.destroy(foundLecture.public_id, { resource_type: 'video' });
        await lecture.findByIdAndDelete(req.params.lectureId);
        await course.findByIdAndUpdate(foundLecture.course, { $inc: { totalLectures: -1 } });
        res.json({ message: "Lecture deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PUT publish / unpublish course
exports.togglePublish = async (req, res) => {
    try {
        const found = await course.findOne({ _id: req.params.id, instructor: req.user.id });
        if (!found) {
            return res.status(404).json({ message: "Course not found or not yours" });
        }
        found.isPublished = !found.isPublished;
        await found.save();
        res.json({ message: `Course ${found.isPublished ? 'published' : 'unpublished'}`, isPublished: found.isPublished });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
