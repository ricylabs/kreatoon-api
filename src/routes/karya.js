const router = require('express').Router();
const multer = require('multer');
const handler = require('../handler/karya');
const validation = require('../handler/validation');

const upload = multer({storage: multer.memoryStorage() });

router.post('/upload', validation.validation, validation.creatorValidation, upload.array('images', 10), handler.uploadKarya);
router.post('/create', validation.validation, validation.creatorValidation, upload.single('image'), handler.newKarya);
router.put('/update', validation.validation, validation.creatorValidation, upload.array('images', 10), handler.updateImage);
router.get('/', handler.getKarya);

module.exports = router;