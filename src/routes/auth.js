const router = require('express').Router();
const handler = require('../handler/auth');

router.post('/register', handler.register);
router.post('/login', handler.login);

module.exports = router;