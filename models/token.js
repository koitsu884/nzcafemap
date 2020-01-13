const mongoose = require('mongoose');
const Schema = mongoose.Schema;

TokenSchema = new Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'user' },
    token: { 
        type: String, 
        required: true,
    },
    type: { type: String, required: true},
    createdAt: { type: Date, required: true, default: Date.now, expires: 3600 }
});
TokenSchema.index({"_userId": 1, "type": 1}, {unique: true});

module.exports.Token = mongoose.model('tokens', TokenSchema);
module.exports.TOKEN_TYPE_VERIFY = 'verification';
module.exports.TOKEN_TYPE_PASSWORD = 'password';