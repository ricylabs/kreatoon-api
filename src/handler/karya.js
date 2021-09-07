const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');
const Karya = require('../model/Karya');

const storage = new Storage({
    projectId: "kreatoon-ylabs",
    keyFilename: "config/kreatoon-ylabs-c17ebd8be6a0.json"
});

const bucket = storage.bucket("kreatoon-ylabs.appspot.com");

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${Date.now()}_${file.originalname}`

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
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

const newKarya = async (req, res) => {
    const { title, desc } = req.body;
    const { _id } = req.user;
    const createdAt = new Date().toISOString();

    const file = req.file;
    if (file) {
        try{
            const url = await uploadImageToStorage(file)
            const karya = new Karya({
                authorId: _id,
                title: title, 
                desc: desc, 
                _id: uuidv4(),
                image: url,
                createdAt, 
                data: []
            });
            await karya.save();
            res.status(200).send({
                status: 'success',
                url: url
            });
        } catch(err) {
            res.send({
                status: 'error',
                message: err
            })
        }
    }
    
    
}

const uploadKarya = (req, res) => {
    console.log('Upload Image');
  
    const file = req.file;
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
}

module.exports = { uploadKarya, newKarya }