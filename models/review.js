const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'user'
    },
    cafe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cafe',
        index: true
    },
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxlength: 50,
    },
    comment:{
        type: String,
        required:true,
        minLength: 2,
        maxlength: 2000
    },
    articleInfo:{
        type: String
    },
    photoURLs: [
        {
            type: String
        }
    ],
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'user'
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

reviewSchema.methods.deleteAllReviewsForUser = function (userId) {
    const token = jwt.sign({ _id: this._id, displayName: this.displayName, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

function validateReview(review) {
    const schema = {
        user: Joi.objectId(),
        cafe: Joi.objectId().required(),
        comment: Joi.string().required().min(2).max(20000),
        title: Joi.string().required().min(2).max(50),
        articleInfo: Joi.string()
    }

    return Joi.validate(review, schema);
}

const Review = mongoose.model('review', reviewSchema, 'reviews');

exports.Review = Review;
exports.validate = validateReview;