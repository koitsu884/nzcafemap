const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        index: true
    },
    cafe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cafe',
        index: true
    },
    rateCoffee: {
        type: Number,
        min:0,
        max:5
    },
    rateFood: {
        type: Number,
        min:0,
        max:5
    },
    rateSweets: {
        type: Number,
        min:0,
        max:5
    },
    rateVibe: {
        type: Number,
        min:0,
        max:5
    }
})

function validateRate(rate) {
    const schema = {
        user: Joi.objectId(),
        cafe: Joi.objectId().required(),
        rateCoffee: Joi.number().integer().min(0).max(5),
        rateFood: Joi.number().integer().min(0).max(5),
        rateSweets: Joi.number().integer().min(0).max(5),
        rateVibe: Joi.number().integer().min(0).max(5)
    }

    return Joi.validate(rate, schema);
}

const Rate = mongoose.model('rate', rateSchema, 'rates');

exports.Rate = Rate;
exports.validateRate = validateRate;