const mongoose = require('mongoose');

const karyaSchema = mongoose.Schema({
    author_id: { type: String, required: true },
    karya: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            data: [
                {
                    chapter: { type: Number },
                    name: { type: String }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Karya Data', karyaSchema);