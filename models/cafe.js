const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        index: true,
    },
    name: {
        type:String,
        required:true,
        minlength: 2,
        maxlength: 255,
        index: true
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photo'
    },
    mainPhotoURL: {
        type: String,
    },
    area: {
        type: String,
        required: true,
        index: true
    },
    placeID:{
        type:String,
        unique: true
    },
    lat: {
        type:Number,
        required: true,
        index: true
    },
    long: {
        type:Number,
        required: true,
        index: true
    },
    address: {
        type: String,
        required: true,
        maxlength: 255
    },
    openingHours: {
        type: String,
        maxLength: 1000
    },
    rateCount: {
        type: Number
    },
    rateCoffeeAve:{
        type: Number,
    },
    rateFoodAve:{
        type: Number,
    },
    rateSweetsAve:{
        type: Number,
    },
    rateVibeAve:{
        type: Number,
    }
});

function validateCafe(cafe) {
    const schema = {
        user: Joi.objectId(),
        name: Joi.string().min(2).max(255).required(),
        area: Joi.string().required(),
        placeID: Joi.string(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        address: Joi.string().required().max(255),
        openingHours: Joi.string().max(1000),
    }

    return Joi.validate(cafe, schema);
}

cafeSchema.index({rateCoffeeAve: -1});
cafeSchema.index({rateCoffeeFood: -1});
cafeSchema.index({rateCoffeeSweets: -1});
cafeSchema.index({rateCoffeeVibe: -1});

const Cafe = mongoose.model('cafe', cafeSchema, 'cafes');

exports.Cafe = Cafe;
exports.validate = validateCafe;