const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    role: {
        type: String,
        required: true,
        default: 'reader'
    }
})

module.exports = mongoose.model('User Data', userSchema);