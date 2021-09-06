const jwt = require('jsonwebtoken');
const User = require('../model/User');

const validation = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verifiedUser = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verifiedUser;
        next();
    }catch(err) {
        res.status(400).send('Invalid Token');
    }
}

const creatorValidation = async (req, res, next) => {
    const verifiedUser = req.user;
    try{
        const user = await User.findById(verifiedUser._id);
        if(user.role !== 'creator') throw "only creators can upload karya";
        next();
    }catch(err) {
        res.status(400).send(err);
    }
}

module.exports = { validation, creatorValidation }
