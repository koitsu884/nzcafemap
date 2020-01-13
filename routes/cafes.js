const express = require('express');
const passport = require('passport');
const router = express.Router();
// const auth = require('../middleware/auth');
const winston = require('winston');

const { cacheRecord, getRecordFromCache, clearHash} = require('../helper/cache');
const { Cafe, validate } = require('../models/cafe');
const { Rate, validateRate } = require('../models/rate');
const { Review } = require('../models/review');
const { Photo } = require('../models/photo');
const { memoryUploadSingle, bufferToDataUri } = require('../helper/formDataHandler');
const { singleUpload, deleteFile } = require('../helper/cloudinaryUploader');

const formDataHandler = memoryUploadSingle('photo');
const searchRecordCacheKey = 'search';

router.get('/latest', async (req, res) => {
    cafes = await Cafe.find().sort({ _id: -1 }).limit(6);
    res.send(cafes);
})

router.get('/mine', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let filters = { user: req.user._id };
    await serachCafes(req, res, filters);
})

router.get('/:id', async (req, res) => {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) res.status(400).send(`データが見つかりませんでした (Cafe id: ${req.params.id}`);

    const latestReviews = await Review.find({ cafe: cafe._id })
        .populate('user', ['displayName', 'mainPhotoURL'])
        .sort({ _id: -1 })
        .limit(5);

    res.send({ cafe: cafe, latestReviews: latestReviews });
});

router.get('/:id/photos/latest', async (req, res) => {
    const photos = await Photo.find({ relatingRecordType: 'Cafe', relatingRecordId: req.params.id })
            .populate('user', ['displayName', 'mainPhotoURL'])
            .limit(4)
            .sort({ _id: -1 });
    res.send(photos);
})

router.get('/:id/photos', async (req, res) => {
    const from = +req.query.from;
    const limit = +req.query.limit;
    const photos = await Photo.find({ relatingRecordType: 'Cafe', relatingRecordId: req.params.id })
        .populate('user', ['mainPhotoURL', 'displayName'])
        .skip(from)
        .limit(limit)
        .sort({ _id: -1 });
    res.send(photos);
})

router.get('/:id/reviews', async (req, res) => {
    const pageSize = +req.query.pageSize;
    const currentPage = + req.query.page;
    const postQuery = Review.find({ cafe: req.params.id });
    const itemCount = await Review.countDocuments({ cafe: req.params.id });

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const reviews = await postQuery.populate('user', ['displayName', 'mainPhotoURL']).sort({ _id: -1 });

    res.send({
        currentPage: currentPage,
        pageSize: pageSize,
        totalCount: itemCount,
        reviews: reviews
    });
})

router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cafe = await Cafe.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            area: req.body.area,
            placeID: req.body.placeID,
            lat: req.body.lat,
            long: req.body.long,
            address: req.body.address,
            openingHours: req.body.openingHours
        },
        { new: false }
    );

    if (!cafe) return res.status(404).send(`カフェ情報が見つかりませんでした.(Cafe ID: ${req.params.id})`);

    res.send(cafe);
})

const getOrderConfig = (order) => {
    switch (order) {
        case 'coffee':
            return { rateCoffeeAve: -1 };
        case 'food':
            return { rateFoodAve: -1 };
        case 'sweets':
            return { rateSweetsAve: -1 };
        case 'vibe':
            return { rateVibeAve: -1 };
        default:
            return { _id: -1 }
    }
}

router.post('/search', async (req, res) => {
    let filters = Object.assign({}, req.body);

    await serachCafes(req, res, filters);
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let data = Object.assign({}, req.body);
    data.user = req.user._id.toString();

    const { error } = validate(data);
    if (error) return res.status(400).send(error.details[0].message);

    let cafe = await Cafe.findOne({ placeID: data.placeID });
    if (cafe) return res.status(400).send("そのグーグルプレイスIDは既に登録されています");

    cafe = new Cafe(data);
    await cafe.save();

    res.status(201).send(cafe);
    clearHash(searchRecordCacheKey);
})

router.post('/:id/photo', passport.authenticate('jwt', { session: false }), formDataHandler, async (req, res) => {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).send(`カフェ情報が見つかりませんでした.(Cafe ID: ${req.params.id})`);
    if (!cafe.user.equals(req.user._id)) return res.status(401).send('更新権限がありません');

    const file = bufferToDataUri(req).content;
    let photo;
    if (cafe.photo) {
        photo = await Photo.findById(cafe.photo.toString());
    }
    else {
        photo = new Photo({
            user: req.user._id,
            ownerRecordType: 'Cafe',
            ownerRecordId: cafe._id
        })
    }

    winston.info(`Uploading cafe photo for cafe ${req.user._id} (${req.file.size} byte)`)
    singleUpload(file, "image", `cafe/${req.params.id}`, "main").then(result => {
        photo.public_id = result.public_id;
        photo.version = result.version;
        photo.save();
        let photoURL = `v${result.version}/${result.public_id}`; //Cloudinaly specific
        cafe.photo = photo._id;
        cafe.mainPhotoURL = photoURL;
        cafe.save();
        res.send(photoURL);
        clearHash(searchRecordCacheKey);
    })
        .catch(err => {
            res.status(400).send("アップロードに失敗しました");
            winston.error(err);
        })
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let data = Object.assign({}, req.body);
    data.user = req.user._id.toString();

    const cafe = await Cafe.findById(req.params.id).populate('photo', ['public_id']);;

    if (!cafe) return res.status(404).send(`カフェ情報が見つかりませんでした.(Cafe ID: ${req.params.id})`);
    if (!cafe.user.equals(req.user._id)) return res.status(401).send('削除権限がありません');

    if (cafe.photo) {
        deleteFile(cafe.photo.public_id)
            .then(result => {
                Photo.remove({ "_id": cafe.photo._id }).exec();
            })
            .catch(err => {
                winston.error(err);
            });
    }
    cafe.remove();

    //Remove all relating reviews
    await Review.deleteMany({ cafe: req.params.id })

    //Delete all relating photos (run background)
    Photo.find({ relatingRecordType: 'Cafe', relatingRecordId: req.params.id })
        .then(async photos => {
            for (let photo of photos) {
                await deleteFile(photo.public_id);
                photo.remove();
            }
        })

    res.send(cafe);
    clearHash(searchRecordCacheKey);
})

router.delete('/:id/photo', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const cafe = await Cafe.findById(req.params.id).populate('photo', ['public_id']);;

    if (!cafe) return res.status(404).send(`カフェ情報が見つかりませんでした.(Cafe ID: ${req.params.id})`);
    if (!cafe.user.equals(req.user._id)) return res.status(401).send('削除権限がありません');

    deleteFile(cafe.photo.public_id)
        .then(result => {
            Photo.remove({ "_id": cafe.photo._id }).exec();
            cafe.photo = undefined;
            cafe.mainPhotoURL = undefined;
            cafe.save();
            res.status(200).send("ファイルを削除しました");
        })
        .catch(err => {
            res.status(400).send("ファイルの削除に失敗しました");
            winston.error(err);
        });
        clearHash(searchRecordCacheKey);
})

//--------------- Cafe rating ----------------
router.get('/:id/rate/user/:userId', async (req, res) => {
    const { userId, id } = req.params;
    const rate = await Rate.findOne({ user: userId, cafe: id });
    if (!rate) {
        return res.status(404).send("レコードが見つかりません - CafeID:" + id + " userID:" + userId);
    }
    return res.send(rate);
})

router.post('/:id/rate', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let data = Object.assign({}, req.body);
    data.user = req.user._id.toString();
    const { error } = validateRate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
        return res.status(400).send("カフェデータが見つかりません ID:" + req.params.id);
    }
    const rate = await Rate.findOne({ user: req.user._id, cafe: req.params.id });
    if (rate) {
        return res.status(400).send("レコードが既に存在します");
    }

    let newRate = new Rate(data);
    await newRate.save();
    calcAverageRates(cafe);

    res.status(201).send(newRate);
    clearHash(searchRecordCacheKey);
})

router.put('/:id/rate', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let data = Object.assign({}, req.body);
    data.user = req.user._id.toString();

    const { error } = validateRate(data);
    if (error) return res.status(400).send(error.details[0].message);

    const rate = await Rate.findOne({ user: req.user._id, cafe: req.params.id });
    if (!rate) {
        return res.status(400).send(`レコードが見つかりません CafeID:${req.params.id} UserID:${req.user._id} `);
    }
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
        return res.status(400).send("カフェデータが見つかりません ID:" + req.params.id);
    }

    rate.rateCoffee = data.rateCoffee;
    rate.rateFood = data.rateFood;
    rate.rateSweets = data.rateSweets;
    rate.rateVibe = data.rateVibe;

    await rate.save();
    calcAverageRates(cafe);

    res.send(rate);
    clearHash(searchRecordCacheKey);
})

router.delete('/:id/rate', passport.authenticate('jwt', { session: false }), formDataHandler, async (req, res) => {
    const rate = await Rate.findOne({ user: req.user._id, cafe: req.params.id });
    if (!rate) {
        return res.status(400).send(`レコードが見つかりません CafeID:${req.params.id} UserID:${req.user._id} `);
    }
    rate.remove();

    res.send(rate);
    clearHash(searchRecordCacheKey);
})


//================= Private functions =================

const serachCafes = async (req, res, filters) => {
    const pageSize = +req.query.pageSize;
    const currentPage = + req.query.page;

    if (filters.nw) {
        filters.lat = { $gt: filters.se.lat, $lt: filters.nw.lat }
        filters.long = { $gt: filters.nw.lng, $lt: filters.se.lng }
        delete filters.nw;
        delete filters.se;
    }

    const postQuery = Cafe.find(filters);
    
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    
    let orderConfig = getOrderConfig(req.query.order);
    
    let cacheKey = Object.assign({}, filters, {
        currentPage: currentPage,
        pageSize: pageSize,
        order: orderConfig
    });

    let recordFromCache = await getRecordFromCache(searchRecordCacheKey, cacheKey);
    if(recordFromCache){
        res.send(JSON.parse(recordFromCache));
        return;
    }
    
    const itemCount = await Cafe.countDocuments(filters);
    const cafes = await postQuery.populate('photo', ['public_id', 'version'])
        .sort(orderConfig);

    let returnData = {
        currentPage: currentPage,
        pageSize: pageSize,
        totalCount: itemCount,
        cafes: cafes
    };

    res.send(returnData);

    cacheRecord(searchRecordCacheKey, cacheKey, returnData);
}

calcAverageRates = async (cafe) => {
    await Rate.aggregate([
        {
            $match: {
                $and: [
                    { cafe: cafe._id },
                    { rateCoffee: { $gte: 1 } }
                ]
            }
        },
        { $group: { _id: cafe._id, rateCoffeeAve: { $avg: '$rateCoffee' } } }
    ]).then(result => {
        cafe.rateCoffeeAve = result[0] ? result[0].rateCoffeeAve : 0
    })
        .catch(error => {
            console.log(error);
        });

    await Rate.aggregate([
        {
            $match: {
                $and: [
                    { cafe: cafe._id },
                    { rateVibe: { $gte: 1 } }
                ]
            }
        },
        { $group: { _id: cafe._id, rateVibeAve: { $avg: '$rateVibe' } } }
    ]).then(result => {
        cafe.rateVibeAve = result[0] ? result[0].rateVibeAve : 0;
    })
        .catch(error => {
            console.log(error);
        });

    await Rate.aggregate([
        {
            $match: {
                $and: [
                    { cafe: cafe._id },
                    { rateSweets: { $gte: 1 } }
                ]
            }
        },
        { $group: { _id: cafe._id, rateSweetsAve: { $avg: '$rateSweets' } } }
    ]).then(result => {
        cafe.rateSweetsAve = result[0] ? result[0].rateSweetsAve : 0;
    })
        .catch(error => {
            console.log(error);
        });

    await Rate.aggregate([
        {
            $match: {
                $and: [
                    { cafe: cafe._id },
                    { rateFood: { $gte: 1 } }
                ]
            }
        },
        {
            $group: {
                _id: cafe._id,
                rateFoodAve: { $avg: '$rateFood' }
            }
        }
    ]).then(result => {
        cafe.rateFoodAve = result[0] ? result[0].rateFoodAve : 0;
    })
        .catch(error => {
            console.log(error);
        });

    cafe.rateCount = await Rate.countDocuments({ cafe: cafe._id });
    await cafe.save();
}

module.exports = router;