const router = require('express').Router();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const {format} = require('util');

const storage = new Storage({
    projectId: "kreatoon-ylabs",
    keyFilename: "kreatoon-ylabs-c17ebd8be6a0.json"
});

const bucket = storage.bucket("kreatoon-ylabs.appspot.com");

const upload = multer({ storage: multer.memoryStorage() });

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
        reject('No image file');
        }
        let newFileName = `${Date.now()}_${file.originalname}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject(error);
        });

        blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

router.post('/upload', upload.single('image'), (req, res) => {
    console.log('Upload Image');
  
    let file = req.file;
    if (file) {
      uploadImageToStorage(file).then((success) => {
        res.status(200).send({
          status: 'success',
          url: success
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  });

module.exports = router;