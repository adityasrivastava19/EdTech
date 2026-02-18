const { Router } = require('express');
const authrouter = Router();
const { signup, login, requestInstructor } = require('../controllers/user/auth');

authrouter.post('/signup', signup);
authrouter.post('/login', login);
authrouter.post('/request-instructor', requestInstructor);

module.exports = authrouter;
