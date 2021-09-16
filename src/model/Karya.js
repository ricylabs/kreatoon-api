const mongoose = require('mongoose');

const karyaSchema = mongoose.Schema({
    authorId: { type: String, required: true },
    _id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    genre: { type: Array, required: true },
    image: { type: String, required: true },
    community: { type: String, required: true },
    favorite: { type: Array },
    createdAt: { type: Date },
    data: [
        {
            chapter: { type: Number },
            name: { type: String },
            image: { type: Array },
            createdAt: { type: Date },
            updatedAt: { type: Date },
        }
    ]
});

module.exports = mongoose.model('Karya Data', karyaSchema);