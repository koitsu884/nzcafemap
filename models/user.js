const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { sendEmailVerification, sendPasswordResetLink } = require('../utils/mailer');
const { Token, TOKEN_TYPE_PASSWORD, TOKEN_TYPE_VERIFY } = require('../models/token');

const TwitterProfile = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
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
    verified: {
        type: Boolean,
        default: false,
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
    introduction: {
        type: String,
        maxlength: 1000
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

/*======================================================
// User pre hooks
=======================================================*/
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

/*======================================================
// User methods
=======================================================*/
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, displayName: this.displayName, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

userSchema.methods.sendPasswordResetEmail = async function () {
    await Token.deleteOne({ _userId: this._id, type: TOKEN_TYPE_PASSWORD });

    let token = new Token({
        _userId: this._id,
        type: TOKEN_TYPE_PASSWORD,
        token: crypto.randomBytes(16).toString('hex')
    });
    await token.save();

    var link = config.get('clientUrl') + "auth/resetpassword/" + token.token;

    try {
        await sendPasswordResetLink(this.email, this.displayName, link)
        console.log("Email sent");
    }
    catch (errors) {
        console.log(JSON.stringify(errors));
    }
}

userSchema.methods.sendVerifyEmail = async function () {
    await Token.deleteOne({ _userId: this._id, type: TOKEN_TYPE_VERIFY });

    let token = new Token({
        _userId: this._id,
        type: TOKEN_TYPE_VERIFY,
        token: crypto.randomBytes(16).toString('hex')
    });
    await token.save();

    var link = config.get('clientUrl') + "auth/verifyemail/" + token.token;

    try {
        await sendEmailVerification(this.email, this.displayName, link)
        console.log("Email sent");
    }
    catch (errors) {
        console.log(JSON.stringify(errors));
    }
}

userSchema.index({verified: 1, isDisabled:1 , isAdmin: 1 })

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = {
        _id: Joi.string(),
        email: Joi.string().min(5).max(255).email().optional(),
        password: Joi.string().min(5).max(255).optional(),
        verified: Joi.boolean().optional(),
        displayName: Joi.string().min(2).max(50).optional(),
        introduction: Joi.string().max(1000).optional().allow(''),
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