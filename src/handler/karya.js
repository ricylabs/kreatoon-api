const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');
const Karya = require('../model/Karya');

const storage = new Storage({
    projectId: "kreatoon-ylabs",
    keyFilename: "config/kreatoon-ylabs-c17ebd8be6a0.json"
});

const bucket = storage.bucket("kreatoon-ylabs.appspot.com");

const uploadImageToStorage = (file, fileName) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let transformedName = fileName.replace(" ", "_");

        let fileUpload = bucket.file(transformedName);

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

const multipleUpload = async (files, karya, chapter, urlList) => {
    for(let i=0; i<files.length; i++) {
        const fileName = `${karya.title}_${karya.authorId}_${chapter}_part${i+1}_${Date.now()}`
        let url = await uploadImageToStorage(files[i], fileName);
        urlList.push(url);
    }
}

const multipleDelete = async (urlList) => {
    for(let i=0; i<urlList.length; i++) {
        let ls = urlList[i].split('/');
        await bucket.file(ls[4]).delete();
    }
}

const newKarya = async (req, res) => {
    const { title, desc } = req.body;
    const { _id } = req.user;
    const createdAt = new Date().toISOString();

    const file = req.file;
    const fileName = `${title}_${_id}`;
    if (file) {
        try{
            const url = await uploadImageToStorage(file, fileName)
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

const uploadKarya = async (req, res) => {
    const { title, name, chapter } = req.body;
    const { _id } = req.user;
    const files = req.files;
    if (files) {
        try{
            const urlList = [];
            const karya = await Karya.findOne({
                authorId: _id,
                title: title
            });
            await multipleUpload(files, karya, chapter, urlList);
            const createdAt = new Date().toISOString();
            const newData = {
                chapter, name, 
                image: urlList,
                createdAt,
                updatedAt: createdAt
            };
            karya.data.push(newData);
            await karya.save();
            res.status(200).send({
                status: 'success',
                url: urlList
            });
        } catch(err) {
            res.send({
                status: 'error',
                message: err
            })
        }
    }
}

const getKarya = async (req, res) => {
    const { authorId, karyaId } = req.body;
    let karya = null;
    if(!authorId && !karyaId) {
        karya = await Karya.find({});
    } else if(!authorId) {
        karya = await Karya.find({ _id: karyaId});
    } else if(!karyaId) {
        karya = await Karya.find({authorId});
    } else {
        karya = await Karya.findOne({ _id: karyaId, authorId });
    }
    res.send(karya);
}

const updateImage = async (req, res) => {
    const { title, chapter } = req.body;
    const { _id } = req.user;
    const files = req.files;
    
    if (files) {
        try{
            const urlList = [];
            const karya = await Karya.findOne({
                title, authorId: _id
            })
            const i = karya.data.findIndex(el => el.chapter)
            await multipleDelete(karya.data[i].image);

            await multipleUpload(files, karya, chapter, urlList);
            
            const updatedAt = new Date().toISOString();
            //
            const newData = {
                chapter, 
                name: karya.name, 
                image: urlList,
                createdAt: karya.createdAt,
                updatedAt: updatedAt
            };


            karya.data.splice(i, 1, newData);
            await karya.save();
            res.status(200).send({
                status: 'success',
                url: urlList
            });
        } catch(err) {
            res.send({
                status: 'error',
                message: err
            })
        }
    }
}

module.exports = { uploadKarya, newKarya, getKarya, updateImage };