const router = require('express').Router();
const multer = require('multer');
const handler = require('../handler/karya');
const validation = require('../handler/validation')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];  
        const name = Date.now() + '-' + file.originalname + '.' + extension;
        cb(null, file.fieldname + '-' + name);
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