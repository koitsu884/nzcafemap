const express = require('express');
const passport = require('passport');
const router = express.Router();
// const auth = require('../middleware/auth');
const winston = require('winston');
const config = require('config');
const request = require('request');
const cheerio = require('cheerio');

const { Cafe } = require('../models/cafe');
const { Review, validate } = require('../models/review');
const { Photo } = require('../models/photo');
const { memoryUploadSingle, bufferToDataUri } = require('../helper/formDataHandler');
const { singleUpload, deleteFile, deleteFolder } = require('../helper/cloudinaryUploader');
const { postTweet, postImage } = require('../helper/twitter');

const formDataHandler = memoryUploadSingle('photo');

router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const reviews = await Review.find(userId ? { user: userId } : {}).populate('cafe', ['name', 'area']);
    res.send(reviews);
})

router.get('/mine', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const pageSize = +req.query.pageSize;
    const currentPage = + req.query.page;
    const postQuery = Review.find({ user: req.user._id });
    const itemCount = await Review.countDocuments({ user: req.user._id });

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const reviews = await postQuery.populate('cafe', ['name', 'area', 'mainPhotoURL']).sort({ _id: -1 });

    res.send({
        currentPage: currentPage,
        pageSize: pageSize,
        totalCount: itemCount,
        reviews: reviews
    });
})

router.get('/latest', async (req, res) => {
    const latestReviews = await Review.find()
        .populate('user', ['displayName', 'mainPhotoURL'])
        .populate('cafe', ['_id', 'name', 'area', 'mainPhotoURL', 'rateCoffeeAve', 'rateFoodAve', 'rateSweetsAve', 'rateVibeAve'])
        .sort({ _id: -1 })
        .limit(12);
    res.send(latestReviews);
})


router.get('/:id', async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) res.status(400).send(`データが見つかりませんでした (Review id: ${req.params.id}`);

    res.send(review);
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let data = Object.assign({}, req.body);
    data.user = req.user._id.toString();

    let cafe = await Cafe.findById(req.body.cafe);
    if (!cafe) res.status(400).send(`データが見つかりませんでした (Cafe id: ${req.body.cafe}`);

    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    review = new Review(data);
    await review.save();
    //    console.log(cafe);
    //let area = cafe.area.split('-')[1];
    // postReviewTweet(cafe.name, area.trim(), review.title, req.user.displayName, getCafeDetailURL(req.body.cafe), getURIFromPublicId(cafe.mainPhotoURL));

    res.status(201).send(review);
})

router.post('/:id/tweet', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let review = await Review.findById(req.params.id)
        .populate('user', ['displayName', 'twitterProfile'])
        .populate('cafe', ['_id', 'name', 'mainPhotoURL', 'area']);

    if (!review) return res.status(400).send("レビューが見つかりません");
    if (!review.user.equals(req.user._id)) return res.status(401).send('更新権限がありません');

    postReviewTweetWithReviewPhotos(review);
    //No need to care weather the tweet was put successfully

    return res.status(200);
})

const getURIFromPublicId = function (mainPhotoURL) {
    return mainPhotoURL ? `https://res.cloudinary.com/${config.get('cloudinaryName')}/image/upload/${mainPhotoURL}` : null;
}

const getCafeDetailURL = function (cafeId) {
    return config.get('clientUrl') + `cafes/${cafeId}`;
}

const postReviewTweet = async (cafeName, area, reviewTitle, reviewUserName, detailURL, imageURL) => {
    status = `【新規レビュー】\n${cafeName} のレビューが追加されました！\n\n「${reviewTitle} (${reviewUserName})」\n\n${detailURL}\n\n#ニュージーランド\n#${area}\n#カフェ巡り`;
    mediaId = null;
    if (imageURL) {
        const options = {
            url: imageURL,
            encoding: null
        }

        request.get(options, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                mediaId = await postImage(new Buffer.from(body).toString('base64'));
                postTweet(status, mediaId);
            }
        });
    }
    else {
        postTweet(status);
    }
}

const postCloudinaryImage = async publicId => {
    let imageUri = getURIFromPublicId(publicId);
    return new Promise((resolve, reject) => {
        request.get({ url: imageUri, encoding: null }, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                mediaId = await postImage(new Buffer.from(body).toString('base64'));
                resolve(mediaId);
            }
            else {
                reject(error);
            }
        });
    })
}

const postReviewTweetWithReviewPhotos = async (review) => {
    let detailURL = getCafeDetailURL(review.cafe._id);
    let area = review.cafe.area.split('-')[1].trim();
    let userName = review.user.twitterProfile ? '@' + review.user.twitterProfile.userName : review.user.displayName;

    status = `【新規レビュー】\n${review.cafe.name} のレビューが追加されました！\n\n「${review.title} (${userName})」\n\n${detailURL}\n\n#ニュージーランド\n#${area}\n#カフェ巡り`;
    mediaIds = [];

    if (review.photoURLs && review.photoURLs.length > 0) {
        for (let publicId of review.photoURLs) {
            if (mediaIds.length < 4) {
                let mediaId = await postCloudinaryImage(publicId);
                if (mediaId) {
                    mediaIds.push(mediaId);
                }
            }
        }
    }
    else if(review.cafe.mainPhotoURL) { //Upload cafe's main image
        let mediaId = await postCloudinaryImage(review.cafe.mainPhotoURL);
        if (mediaId) {
            mediaIds.push(mediaId);
        }
    }

    postTweet(status, mediaIds.join(','));
}

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).send(`カフェ情報が見つかりませんでした.(Review ID: ${req.params.id})`);
    if (!review.user.equals(req.user._id)) return res.status(401).send('削除権限がありません');

    review.remove();

    //Should delete all photos here
    let folderPath = 'review/' + req.params.id;
    deleteFolder(folderPath);
    await Photo.deleteMany({ ownerRecordType: 'Review', ownerRecordId: req.params.id });

    res.send(review);
})

router.post('/:id/photo', passport.authenticate('jwt', { session: false }), formDataHandler, async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).send(`レビューが見つかりませんでした.(Review ID: ${req.params.id})`);
    if (!review.user.equals(req.user._id)) return res.status(401).send('更新権限がありません');

    const file = bufferToDataUri(req).content;

    winston.info(`Uploading review photo for review ${req.user._id} (${req.file.size} byte)`)
    singleUpload(file, "image", `review/${req.params.id}`, req.file.originalname)
        .then(result => {
            const photo = new Photo({
                user: req.user._id,
                ownerRecordType: 'Review',
                ownerRecordId: review._id,
                relatingRecordType: 'Cafe',
                relatingRecordId: review.cafe,
                public_id: result.public_id,
                version: result.version
            });
            photo.save();
            let photoURL = `v${result.version}/${result.public_id}`; //Cloudinaly specific
            if (review.photoURLs) {
                review.photoURLs.push(photoURL);
            }
            else {
                review.photoURLs = [photoURL];
            }
            review.save();
            res.send(photoURL);
        })
        .catch(err => {
            res.status(400).send("アップロードに失敗しました");
            winston.error(err);
        })
})


//----------------- Utils ------------
router.post('/linkPreview', passport.authenticate('jwt', { session: false }), async (req, res) => {
    var link = {};
    link.url = req.body.url;

    request(
        req.body.url,
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                try {
                    const $ = cheerio.load(html);
                    link.title = $("meta[property='og:title']").attr("content");
                    link.image = $("meta[property='og:image']").attr("content");
                    link.description = $("meta[property='og:description']").attr("content");
                    link.site_name = $("meta[property='og:site_name']").attr("content");
                    res.send(link);
                } catch (e) {
                    res.status(400).send(`リンク先情報を取得できませんでした`)
                }

            }
            else {
                res.status(400).send(`リンク先情報を取得できませんでした`);
            }
        }
    )
})

module.exports = router;