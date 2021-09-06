const router = require('express').Router();
const multer = require('multer');
const handler = require('../handler/karya');

const upload = multer({storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), handler.uploadKarya);

module.exports = router;