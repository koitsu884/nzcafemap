const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const TwitterProfile = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    url:{
        type: String
    },
    imageUrl: {
        type: String
    }
}, { _id: false })

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        index: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        select: false,
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
    twitterId: {
        type: String,
        index: true
    },
    twitterProfile: {
        type: TwitterProfile,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
},{ versionKey: false });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, displayName: this.displayName, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = {
        _id: Joi.string(),
        email: Joi.string().min(5).max(255).email().optional(),
        password: Joi.string().min(5).max(255).optional(),
        displayName: Joi.string().min(2).max(50).required(),
        mainPhotoURL: Joi.string(),
        twitterId: Joi.string().optional(),
        twitterProfile: Joi.object().optional(),
        isAdmin: Joi.boolean(),
        isDisabled: Joi.boolean()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;