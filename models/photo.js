const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    public_id: {
        type: String,
        required:true
    },
    version: {
        type:String,
        required: true
    },
    ownerRecordType: {
        type:String
    },
    ownerRecordId: {
        type:String
    },
    relatingRecordType: {
        type: String
    },
    relatingRecordId: {
        type: String
    }
});

const Photo = mongoose.model('photo', photoSchema, 'photos');

exports.Photo = Photo;