
// const auth = require('../middleware/auth');
const express = require('express');
const passport = require('passport');
const winston = require('winston');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const {Photo} = require('../models/photo');
const {Review} = require('../models/review');
const {Rate} = require('../models/rate');
const {Cafe} = require('../models/cafe');
const {memoryUploadSingle, bufferToDataUri } = require('../helper/formDataHandler');
const {singleUpload, deleteFile, deleteFolder} = require('../helper/cloudinaryUploader');

const formDataHandler = memoryUploadSingle('photo');

returnUser = user => {
    return _.pick(user, ['_id', 'isAdmin', 'isDisabled', 'email', 'displayName', 'mainPhotoURL']);
}


// router.get('/:id', passport.authenticate('jwt', { session: false }), async ( req, res) => {
//     const user = await User.findById(req.params.id).select('-password');
//     if(user._id.toString() !== req.user._id) return res.status(401).send("Used does not match");
//     res.send(user);
// });

router.get('/me', passport.authenticate('jwt', { session: false }), async ( req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(returnUser(user));
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if( error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("そのＥメールアドレスは既に使用されています");
    
    user = new User(_.pick(req.body, ['email', 'password', 'displayName']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(returnUser(user));
})

router.post('/photo', passport.authenticate('jwt', { session: false }), formDataHandler, async(req, res) => {
    let user = await User.findById(req.user._id);

    const file = bufferToDataUri(req).content;
    let photo;
    if(user.photo){
        photo = await Photo.findById(user.photo.toString());
    }
    else{
        photo = new Photo({
            user:req.user._id,
            ownerRecordType: 'User',
            ownerRecordId: req.user._id
        })
    }
    
    winston.info(`Uploading user photo for user ${req.user._id} (${req.file.size} byte)`)
    singleUpload(file, "image", `user/${req.user._id}`, "prof").then(result => {
        photo.public_id = result.public_id;
        photo.version = result.version;
        photo.save();
        let photoURL = `v${result.version}/${result.public_id}`; //Cloudinary specific
        user.photo = photo._id;
        user.mainPhotoURL = photoURL;
        user.save();
        res.send(photoURL);
    })
    .catch(err => {
        res.status(400).send("アップロードに失敗しました");
        winston.error(err);
    })
})

router.delete('/', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let user = await User.findById(req.user._id).populate('photo', ['public_id']);
    if(user.photo){
        deleteFile(user.photo.public_id)
    }
    //Delete all reviews relating the user
    const reviews = await Review.find({user:user._id});
    for(var review of reviews){
        let folderPath = 'review/' + review._id;
        deleteFolder(folderPath); //Delete file from Cloudinary
        review.remove();
    }
    //Delete all photos (DB data, not actual image file) relating the user
    await Photo.deleteMany({user:user._id});
    await Rate.deleteMany({user:user._id});
    const cafes = await Cafe.find({user:user._id});
    for(var cafe of cafes){
        cafe.user = null;
        cafe.save();
    }
    user.remove();

    res.send(returnUser(user));
})

router.delete('/photo', passport.authenticate('jwt', { session: false }), async(req, res) => {
    let user = await User.findById(req.user._id).populate('photo', ['public_id']);

    deleteFile(user.photo.public_id)
    .then(result => {
        Photo.remove({"_id": user.photo._id}).exec();
        user.photo = undefined;
        user.mainPhotoURL = undefined;
        user.save();
        res.status(200).send("ファイルを削除しました");
    })
    .catch(err => {
        res.status(400).send("ファイルの削除に失敗しました");
        winston.error(err);
    });
})

router.put('/', passport.authenticate('jwt', { session: false }), async ( req, res) => {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(404).send("ユーザーが見つかりません");
 
    let data = req.body;

    if(data.password)
    {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(data.password, salt);
    } 
    else {
        data.password = user.password;
    }
    const { error } = validate(data);
    if( error) return res.status(400).send(error.details[0].message);


    if( user.email !== data.email){
        if(await User.findOne({email: data.email}))
            return res.status(400).send("そのＥメールアドレスは既に使用されています");
        user.email = data.email
    }

    user.displayName = data.displayName;

    user = await user.save();
    res.send(returnUser(user));
})

module.exports = router;