const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const { v4: uuidv4 } = require('uuid');
const Karya = require('../model/Karya');

const storage = new Storage({
    projectId: "kreatoon-ylabs",
    keyFilename: "config/kreatoon-ylabs-743826024b97.json"
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
    const { title, desc, genre, community } = req.body;
    const { _id } = req.user;
    const createdAt = new Date().toISOString();

    const file = req.file;
    const fileName = `${title}_${_id}_${Date.now()}`;
    if (file) {
        try{
            const url = await uploadImageToStorage(file, fileName)
            const karya = new Karya({
                authorId: _id,
                title, 
                desc, 
                _id: uuidv4(),
                genre, community,
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
    const { _id, name, chapter } = req.body;
    const id = req.user._id;
    const files = req.files;

    if (files) {
        try{
            const urlList = [];
            const karya = await Karya.findOne({
                authorId: id,
                _id
            });
            const i = karya.data.findIndex(el => el.chapter==chapter);
            if(i>-1) return res.send('chapter already exists');

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
    else {
        res.status(404).send({
            status: 'error',
            message: 'image or karya not found'
        })
    }
    
}

const findKarya = async (req, res) => {
    const { title, genre } = req.query;
    const data = [];
    if(!title && !genre) {
        const karya = await Karya.find({});
        return res.status(200).send(karya);
    }
    if(title) {
        const karya = await Karya.find({ title: { $regex: title } });
        data.push(karya)
    }
    if(genre) {
        const karya = await Karya.find({ genre: genre });
        data.push(karya)
    }
    const uniqueData = [...new Set(data)];
    res.send(uniqueData);
}

const getKaryaById = async (req, res) => {
    const { id } = req.params;

    const karya = await Karya.findOne({ _id: id });
    if(!karya) res.send({
        message: "karya not found"
    }) 
    res.status(200).send(karya);
}

const updateChapter = async (req, res) => {
    const { _id, chapter, name } = req.body;
    const id = req.user._id;
    const files = req.files;
    
    if (files) {
        try{
            const urlList = [];
            const karya = await Karya.findOne({
                _id, authorId: id
            })

            const i = karya.data.findIndex(el => el.chapter==chapter);
            if(i == -1) return res.send('chapter doesnt exists');

            await multipleDelete(karya.data[i].image);

            await multipleUpload(files, karya, chapter, urlList);
            
            const updatedAt = new Date().toISOString();
            //
            const newData = {
                chapter, 
                name, 
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
    else {
        res.status(404).send({
            status: 'error',
            message: 'image or karya not found'
        }) 
    }
    
}

module.exports = { uploadKarya, newKarya, updateChapter, getKaryaById, findKarya };