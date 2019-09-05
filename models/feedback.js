const Joi = require('joi');
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    name:{
        type: String,
        required: true,
        minLength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
        maxlength: 10000
    }
});

function validateFeedback(feedback){
    const schema = {
        title: Joi.string().min(5).max(100).required(),
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(2).max(255).required().email(),
        content: Joi.string().min(10).max(10000).required()
    }

    return Joi.validate(feedback, schema);
}

const Feedback = mongoose.model('Feedback', feedbackSchema);

exports.Feedback = Feedback;
exports.validate = validateFeedback;

