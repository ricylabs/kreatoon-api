const router = require('express').Router();
const multer = require('multer');
const handler = require('../handler/karya');
const validation = require('../handler/validation')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') cb(null, true);
    else cb(null, false);
}

const upload = multer({
    storage: fileStorage, fileFilter
})

router.post('/upload', validation, upload.single('image'), handler.uploadKarya);

module.exports = router;