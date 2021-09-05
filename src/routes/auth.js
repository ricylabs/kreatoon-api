const router = require('express').Router();
const User = require('../model/User');
const handler = require('../handler/auth');

router.post('/register', handler.register);
router.post('/login', handler.login);

module.exports = router;