const { Router } = require('express');
const router = Router();
const { getCourses, getcourse, watch } = require('../controllers/user/coursecon');
const { createorder, verifyorder } = require('../controllers/user/purchase');
const { isAuth } = require('../middleware/auth');

// Course routes (public)
router.get('/courses', getCourses);
router.get('/courses/:id', getcourse);

// Protected: watch course (must have purchased)
router.get('/courses/:id/watch', isAuth, watch);

// Purchase routes (protected)
router.post('/purchase/create-order', isAuth, createorder);
router.post('/purchase/verify-order', isAuth, verifyorder);

module.exports = router;
