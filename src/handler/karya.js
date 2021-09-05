const uploadKarya = (req, res) => {
    if(!req.file) {
        res.status(400).send({
            message: 'content not found'
        })
    };
    const image = req.file.path;
    res.send({
        message: 'success',
        user: req.user,
        image
    })
}

module.exports = { uploadKarya }