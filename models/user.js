const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    displayName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photo'
    },
    mainPhotoURL: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, displayName: this.displayName, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = {
        _id: Joi.string(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        displayName: Joi.string().min(2).max(50).required(),
        mainPhotoURL: Joi.string(),
        isAdmin: Joi.boolean(),
        isDisabled: Joi.boolean()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;