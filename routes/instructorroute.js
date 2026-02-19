const { Router } = require('express');
const router = Router();
const {
    getMyCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    addLecture,
    getLectures,
    deleteLecture,
    togglePublish
} = require('../controllers/instructor/instructor');
const { isAuth, isInstructor } = require('../middleware/auth');

// All instructor routes require login + instructor role
router.use(isAuth, isInstructor);

router.get('/courses', getMyCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id/publish', togglePublish);

router.get('/courses/:id/lectures', getLectures);
router.post('/courses/:id/lectures', addLecture);
router.delete('/courses/:id/lectures/:lectureId', deleteLecture);

module.exports = router;
