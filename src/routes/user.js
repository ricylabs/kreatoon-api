const router = require('express').Router();
const handler = require('../handler/user');
const validation = require('../handler/validation');

router.put('/role', validation.validation, handler.editRole);

module.exports = router;