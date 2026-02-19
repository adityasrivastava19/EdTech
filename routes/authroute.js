const { Router } = require('express');
const authrouter = Router();
const { signup, login, requestInstructor } = require('../controllers/user/auth');
const { isAuth } = require('../middleware/auth');

authrouter.post('/signup', signup);
authrouter.post('/login', login);
authrouter.post('/request-instructor', isAuth, requestInstructor);

module.exports = authrouter;
