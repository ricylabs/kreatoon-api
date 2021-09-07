const mongoose = require('mongoose');

const karyaSchema = mongoose.Schema({
    authorId: { type: String, required: true },
    _id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true},
    createdAt: { type: Date },
    data: [
        {
            chapter: { type: Number },
            name: { type: String },
            createdAt: { type: Date },
            updatedAt: { type: Date }
        }
    ]
});

module.exports = mongoose.model('Karya Data', karyaSchema);