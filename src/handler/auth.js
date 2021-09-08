const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { v4: uuidv4 } = require('uuid');

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

const register = async (req, res) => {
    const { email, password } = req.body;

    const { error } = registerValidation({ email, password });
    if( error ) return res.status(400).send(err.details[0].message);

    const emailExists = await User.findOne({ email });
    if(emailExists) return res.status(400).send("email already exists");

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const user = new User({ _id: uuidv4(), email, password: hashedPass})
    try{
        await user.save()
        res.send("registration success");
    }catch(err){
        res.status(400).send(err)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginValidation({ email, password });
    if( error ) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email });
    if(!user) return res.status(400).send("incorrect email/password");

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(400).sendFile("invalid pass");

    const token = jwt.sign({
        _id: user._id
    }, process.env.SECRET_TOKEN);
    res.header('auth-token', token).send("youre logged in")

}

module.exports = { register, login };